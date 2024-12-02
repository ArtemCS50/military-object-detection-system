import cv2
import base64
from collections import defaultdict, deque
from scipy.spatial import distance
from utils.yolo_model import get_model, get_class_color

tracked_objects = defaultdict(lambda: deque(maxlen=5))
distance_threshold = 50
unique_object_counts = defaultdict(int)

def process_video(input_path, output_path, socketio, user_email, save_object_counts):
    model = get_model()
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

        writer.write(frame)
        _, buffer = cv2.imencode('.jpg', frame)
        frame_base64 = base64.b64encode(buffer).decode('utf-8')

        socketio.emit('video_frame', {'frame': frame_base64})
        socketio.sleep(0.1)

    capture.release()
    writer.release()
    socketio.emit('processing_complete', {'counts': dict(unique_object_counts)})
    save_object_counts(dict(unique_object_counts), user_email)
