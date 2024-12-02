from flask import Blueprint, request, jsonify
from services.image_processing import process_image
from utils.socket_events import socketio
from config import UPLOAD_FOLDER

image_bp = Blueprint('image_bp', __name__)

@image_bp.route('/process_image', methods=['POST'])
def process_image_route():
    file = request.files['file']
    user_email = request.form['email']
    input_path = f"{UPLOAD_FOLDER}/input_image.jpg"
    output_path = f"{UPLOAD_FOLDER}/output_image.jpg"
    file.save(input_path)

    object_counts = process_image(input_path, output_path, socketio, save_object_counts, user_email)
    return jsonify({"message": "Image processing completed", "counts": object_counts})
