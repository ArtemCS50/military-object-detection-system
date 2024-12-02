import React from 'react';
import {Alert} from 'react-bootstrap';

function OriginalVideo({videoUrl}) {
    return videoUrl ? (
        <video
            src={videoUrl}
            controls
            autoPlay
            muted
            style={{maxWidth: '100%', height: 'auto', border: '1px solid #ddd', borderRadius: '5px'}}
        />
    ) : (
        <div className="text-center">
            <Alert variant="info">Виберіть відео для завантаження</Alert>
        </div>
    );
}

export default OriginalVideo;
