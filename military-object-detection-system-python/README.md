# Military Object Detection - Python ML Service

Flask-based microservice for real-time object detection using YOLOv8.

## Overview

This service handles the AI/ML processing for the Military Object Detection System. It receives images and videos from the Spring Boot backend, performs object detection using a custom-trained YOLOv8 model, and returns annotated results.

## Features

- Real-time video processing with WebSocket streaming
- Image processing with object detection and counting
- Advanced object tracking to prevent duplicate counting
- Confidence-based detection thresholds
- Color-coded bounding boxes per object class

## Tech Stack

- **Flask** - Web framework
- **YOLOv8** (Ultralytics) - Object detection model
- **OpenCV** - Computer vision and image processing
- **Flask-SocketIO** - Real-time bidirectional communication
- **SciPy** - Scientific computing for distance calculations
- **NumPy** - Numerical computing

## Setup

### Prerequisites
- Python 3.8+
- Virtual environment (recommended)
- Trained YOLOv8 model file (`best.pt`)

### Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r app/requirements.txt

# Place your trained model
# Copy best.pt to app/best.pt
```

### Running the Service

```bash
python -m app.app
```

The service will start on `http://0.0.0.0:5000`

## Configuration

Edit `app/app.py` to configure:
- **CORS origins**: Currently set to `http://localhost:3000`
- **Model path**: Defaults to `app/best.pt`
- **Upload paths**: `uploads/` directory for temporary files
- **Distance threshold**: For object tracking (default: 95 pixels)

## API Endpoints

### Process Video
```http
POST /process_video
Content-Type: multipart/form-data

file: [video file]
email: user@example.com
```

Starts background video processing and streams frames via WebSocket.

### Process Image
```http
POST /process_image
Content-Type: multipart/form-data

file: [image file]
email: user@example.com
```

Returns processed image with object counts.

## WebSocket Events

### Client → Server
- `connect` - Client connection established
- `disconnect` - Client disconnected

### Server → Client
- `video_frame` - Streaming processed video frames (base64 encoded)
- `processing_complete` - Final object counts when video processing completes
- `image_processed` - Processed image result with counts

## Object Tracking Algorithm

The service implements an advanced tracking algorithm:

1. **Detection**: YOLOv8 detects objects in each frame
2. **Center Calculation**: Calculates center point of each bounding box
3. **Distance Comparison**: Compares with previously tracked objects
4. **Confidence Adjustment**: Adjusts distance threshold based on detection confidence
5. **Unique Counting**: Only counts objects not previously tracked

This prevents counting the same object multiple times across frames.

## Model Requirements

The service expects a YOLOv8 model trained to detect:
- Military vehicles (tanks, trucks, etc.)
- Artillery
- Personnel
- Explosions
- Other military objects

Place your trained model file (`best.pt`) in the `app/` directory.

## Directory Structure

```
app/
├── routes/              # API route handlers
│   ├── image_routes.py
│   └── video_routes.py
├── services/            # Processing logic
│   ├── image_processing.py
│   └── video_processing.py
├── utils/               # Utilities
│   ├── socket_events.py
│   └── yolo_model.py
├── uploads/             # Temporary file storage
├── app.py               # Main application
├── requirements.txt     # Dependencies
└── best.pt             # YOLO model (not in git)
```

## Integration

This service integrates with:
- **Spring Boot Backend** (`localhost:8080`) - Receives requests and sends results
- **React Frontend** (`localhost:3000`) - WebSocket connection for real-time updates

## Development

### Adding New Object Classes

1. Retrain YOLOv8 model with new classes
2. Update model file (`best.pt`)
3. No code changes needed - class names are read from model

### Adjusting Tracking Sensitivity

Modify `distance_threshold` in `app.py`:
- **Lower value** = More strict (may count duplicates)
- **Higher value** = More lenient (may miss unique objects)

## Troubleshooting

### Model Not Found
Ensure `best.pt` is in the `app/` directory and accessible.

### WebSocket Connection Failed
Check CORS settings and ensure React frontend is running on `http://localhost:3000`.

### Out of Memory
Reduce video resolution or process in smaller batches. Adjust `maxlen` for `tracked_objects` deque.

## License

MIT

