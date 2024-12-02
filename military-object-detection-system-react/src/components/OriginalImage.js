import React from 'react';
import { Alert, Image } from 'react-bootstrap';

function OriginalImage({ imageUrl }) {
    return imageUrl ? (
        <Image src={imageUrl} alt="Uploaded" fluid style={{ border: '1px solid #ddd', borderRadius: '5px' }} />
    ) : (
        <Alert variant="info">Виберіть зображення для завантаження</Alert>
    );
}

export default OriginalImage;
