from flask import Blueprint, request, jsonify
from services.video_processing import process_video
from utils.socket_events import socketio
from config import UPLOAD_FOLDER

video_bp = Blueprint('video_bp', __name__)

@video_bp.route('/process_video', methods=['POST'])
def process_video_route():
    file = request.files['file']
    user_email = request.form['email']
    input_path = f"{UPLOAD_FOLDER}/input.mp4"
    output_path = f"{UPLOAD_FOLDER}/output.mp4"
    file.save(input_path)

    socketio.start_background_task(process_video, input_path, output_path, socketio, user_email)
    return jsonify({"message": "Processing started"})
