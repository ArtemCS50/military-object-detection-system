from flask_socketio import SocketIO

def configure_socket_events(socketio):
    @socketio.on('connect')
    def handle_connect():
        print("Client connected")

    @socketio.on('disconnect')
    def handle_disconnect():
        print("Client disconnected")


@socketio.event
def connect():
    print('Client connected')

@socketio.event
def disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
