from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
import cv2
import base64
import os
import time
import requests
from flask_cors import CORS
from ultralytics import YOLO
from collections import defaultdict, deque
from scipy.spatial import distance

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

# Ініціалізація YOLO моделі
model = YOLO('/Education/testYOLO/venv/Lib/site-packages/pip/best.pt')

class_colors = {}
tracked_objects = defaultdict(lambda: deque(maxlen=5))
distance_threshold = 95
unique_object_counts = defaultdict(int)

def get_class_color(label):
    if label not in class_colors:
        class_colors[label] = (
            int(255 * hash(label) % 256),
            int(255 * hash(label + '1') % 256),
            int(255 * hash(label + '2') % 256)
        )
    return class_colors[label]

@app.route('/process_video', methods=['POST'])
def process_video():
    if 'file' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400

    video_file = request.files['file']
    user_email = request.form['email']  # Отримуємо email користувача
    input_video_path = 'uploads/input.mp4'
    output_video_path = 'uploads/output.avi'
    video_file.save(input_video_path)

    socketio.start_background_task(process_and_stream_video, input_video_path, output_video_path, user_email)
    return jsonify({'message': 'Video processing started'})


def save_object_counts_to_spring(object_counts, user_email):
    url = 'http://localhost:8080/api/videos/save-counts'  # Ендпоінт Spring-сервера
    data = {
        'email': user_email,
        'counts': object_counts
    }
    try:
        response = requests.post(url, json=data)
        response.raise_for_status()
        print("Object counts saved to Spring server.")
    except requests.exceptions.RequestException as e:
        print(f"Error saving object counts: {e}")

def process_and_stream_video(input_path, output_path, user_email):
    capture = cv2.VideoCapture(input_path)
    fps = int(capture.get(cv2.CAP_PROP_FPS))
    width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    writer = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    while True:
        ret, frame = capture.read()
        if not ret:
            break

        object_counts_frame = defaultdict(int)
        results = model(frame)[0]

        for r in results:
            for box in r.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                confidence = box.conf[0] if hasattr(box, 'conf') else 0.0
                label = box.cls[0] if hasattr(box, 'cls') else 'unknown'
                label_name = model.names[int(label)]
                color = get_class_color(label_name)

                object_center = ((x1 + x2) // 2, (y1 + y2) // 2)
                new_object = True

                for prev_center in tracked_objects[label_name]:
                    adjusted_threshold = distance_threshold * (1 + (1 - confidence))
                    if distance.euclidean(object_center, prev_center) < adjusted_threshold:
                        new_object = False
                        break

                if new_object:
                    unique_object_counts[label_name] += 1
                tracked_objects[label_name].append(object_center)
                object_counts_frame[label_name] += 1

                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(frame, f"{label_name} {confidence:.2f}", (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        y_offset = 30
        for label_name, count in object_counts_frame.items():
            color = get_class_color(label_name)
            cv2.putText(frame, f"{label_name}: {count}", (10, y_offset),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            y_offset += 20

        writer.write(frame)
        _, buffer = cv2.imencode('.jpg', frame)
        frame_base64 = base64.b64encode(buffer).decode('utf-8')

        socketio.emit('video_frame', {'frame': frame_base64})
        socketio.sleep(0.1)

    capture.release()
    writer.release()

    # Відправляємо фінальний результат через WebSocket
    socketio.emit('processing_complete', {'counts': dict(unique_object_counts)})

    # Зберігаємо результати у файл
    with open("uploads/object_counts.txt", "w") as file:
        for label_name, count in unique_object_counts.items():
            file.write(f"{label_name}: {count}\n")

    save_object_counts_to_spring(dict(unique_object_counts), user_email)


@app.route('/process_image', methods=['POST'])
def process_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['file']
    user_email = request.form['email']
    input_image_path = 'uploads/input_image.jpg'
    output_image_path = 'uploads/output_image.jpg'

    # Зберігаємо зображення
    image_file.save(input_image_path)

    # Обробляємо зображення
    object_counts = process_and_save_image(input_image_path, output_image_path, user_email)

    return jsonify({'message': 'Image processing completed', 'counts': object_counts})


def process_and_save_image(input_path, output_path, user_email):
    frame = cv2.imread(input_path)

    object_counts_frame = defaultdict(int)
    results = model(frame)[0]

    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            confidence = box.conf[0] if hasattr(box, 'conf') else 0.0
            label = box.cls[0] if hasattr(box, 'cls') else 'unknown'
            label_name = model.names[int(label)]
            color = get_class_color(label_name)

            object_center = ((x1 + x2) // 2, (y1 + y2) // 2)
            new_object = True

            for prev_center in tracked_objects[label_name]:
                adjusted_threshold = distance_threshold * (1 + (1 - confidence))
                if distance.euclidean(object_center, prev_center) < adjusted_threshold:
                    new_object = False
                    break

            if new_object:
                unique_object_counts[label_name] += 1
            tracked_objects[label_name].append(object_center)
            object_counts_frame[label_name] += 1

            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, f"{label_name} {confidence:.2f}", (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)


    y_offset = 30
    for label_name, count in object_counts_frame.items():
        color = get_class_color(label_name)
        cv2.putText(frame, f"{label_name}: {count}", (10, y_offset),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        y_offset += 20

    # Зберігаємо оброблене зображення
    cv2.imwrite(output_path, frame)

    # Відправляємо зображення через WebSocket
    _, buffer = cv2.imencode('.jpg', frame)
    frame_base64 = base64.b64encode(buffer).decode('utf-8')
    socketio.emit('image_processed', {'frame': frame_base64, 'counts': dict(object_counts_frame)})

    # Зберігаємо результати в Spring
    save_object_counts_to_spring(dict(object_counts_frame), user_email)

    return dict(object_counts_frame)


@socketio.event
def connect():
    print('Client connected')

@socketio.event
def disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)