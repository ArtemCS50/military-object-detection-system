import React, { useState, useEffect } from 'react';
import { Spinner, Image } from 'react-bootstrap';
import { io } from 'socket.io-client';
import LoadingMessage from "../message/LoadingMessage";

function ProcessedImage() {
    const [frame, setFrame] = useState(null);

    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('connect', () => console.log('Connected to WebSocket server'));
        socket.on('image_processed', (data) => setFrame(`data:image/jpeg;base64,${data.frame}`));
        socket.on('disconnect', () => console.log('Disconnected from WebSocket server'));

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            {frame ? (
                <Image src={frame} alt="Processed Image" fluid style={{ border: '1px solid #ddd', borderRadius: '5px' }}/>
            ) : (
                <div className="text-center">
                    <LoadingMessage message={"Зачекайте, обробка зображення..."}/>
                </div>
            )}
        </div>
    );
}

export default ProcessedImage;
