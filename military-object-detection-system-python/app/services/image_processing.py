import cv2
from collections import defaultdict
from utils.yolo_model import get_model, get_class_color
from services.video_processing import save_object_counts
import requests
from config import SPRING_API_URL

def save_object_counts(object_counts, user_email):
    data = {
        'email': user_email,
        'counts': object_counts
    }
    try:
        response = requests.post(SPRING_API_URL, json=data)
        response.raise_for_status()
        print("Object counts saved to Spring server.")
    except requests.exceptions.RequestException as e:
        print(f"Error saving object counts: {e}")

def process_image(input_path, output_path, socketio, save_object_counts, user_email):
    model = get_model()
    frame = cv2.imread(input_path)
    object_counts_frame = defaultdict(int)

    results = model(frame)[0]
    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            label = box.cls[0]
            label_name = model.names[int(label)]
            color = get_class_color(label_name)
            object_counts_frame[label_name] += 1
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, label_name, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)


    cv2.imwrite(output_path, frame)
    _, buffer = cv2.imencode('.jpg', frame)
    frame_base64 = base64.b64encode(buffer).decode('utf-8')
    socketio.emit('image_processed', {'frame': frame_base64, 'counts': dict(object_counts_frame)})

    save_object_counts(dict(object_counts_frame), user_email)
    return object_counts_frame
