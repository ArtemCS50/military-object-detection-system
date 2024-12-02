from ultralytics import YOLO

_model = None
class_colors = {}

def get_model():
    global _model
    if _model is None:
        _model = YOLO('/Education/testYOLO/venv/Lib/site-packages/pip/best.pt')  
    return _model

def get_class_color(label):
    if label not in class_colors:
        class_colors[label] = (
            int(255 * hash(label) % 256),
            int(255 * hash(label + '1') % 256),
            int(255 * hash(label + '2') % 256)
        )
    return class_colors[label]
