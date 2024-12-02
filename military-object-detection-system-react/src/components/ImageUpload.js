import React from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';

function ImageUpload({ onUpload }) {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onUpload(file);
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col xs={12} md={6} className="text-center">
                    <Form.Group className="mb-3">
                        <Form.Label><strong>Завантажити зображення</strong></Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
                    </Form.Group>
                </Col>
            </Row>
        </Container>
    );
}

export default ImageUpload;
