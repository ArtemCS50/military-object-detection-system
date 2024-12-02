import React from 'react';
import { Spinner } from 'react-bootstrap';

function LoadingMessage({ message }) {
    return (
        <div className="d-flex align-items-center justify-content-center my-3">
            <Spinner animation="border" role="status" className="me-2" />
            <span>{message}</span>
        </div>
    );
}

export default LoadingMessage;
