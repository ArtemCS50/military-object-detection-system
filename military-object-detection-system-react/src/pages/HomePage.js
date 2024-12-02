import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import OriginalVideo from '../components/OriginalVideo';
import ProcessedVideo from '../components/ProcessedVideo';
import VideoUpload from '../components/VideoUpload';
import { fetchObjectCounts, uploadVideo, uploadVideoBackend } from '../api/videoApi';
import { uploadImage, uploadImageBackend } from '../api/imageApi';
import ImageUpload from '../components/ImageUpload';
import OriginalImage from '../components/OriginalImage';
import ProcessedImage from '../components/ProcessedImage';
import ObjectCountsTable from '../components/ObjectCountsTable';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const { authToken } = useAuth();
    const [view, setView] = useState(null); // 'video' | 'image'
    const [originalVideo, setOriginalVideo] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);
    const [objectCounts, setObjectCounts] = useState([]);
    const [loading, setLoading] = useState(false);

    const updateObjectCounts = async () => {
        setLoading(true);
        try {
            const counts = await fetchObjectCounts(authToken);
            setObjectCounts(counts);
        } catch (error) {
            console.error('Error updating object counts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVideoUpload = async (file) => {
        const videoUrl = URL.createObjectURL(file);
        setOriginalVideo(videoUrl);
        await uploadVideo(file);
        await uploadVideoBackend(file, authToken);
        await updateObjectCounts();
    };

    const handleImageUpload = async (file) => {
        setOriginalImage(URL.createObjectURL(file));
        await uploadImage(file);
        await uploadImageBackend(file, authToken);
        await updateObjectCounts();
    };

    useEffect(() => {
        if (authToken) {
            updateObjectCounts();
        }
    }, [authToken]);

    if (!authToken) {
        return (
            <Container className="text-center mt-5">
                <h4>Будь ласка, увійдіть, щоб отримати доступ до цієї сторінки.</h4>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row className="text-center mb-4">
                <Col>
                    {!view && (
                        <div>
                            <Button variant="primary" className="mx-2" onClick={() => setView('video')}>
                                Обробка відео
                            </Button>
                            <Button variant="secondary"  className="mx-2" onClick={() => setView('image')} style={{ backgroundColor: 'purple' }}>
                                Обробка зображення
                            </Button>
                        </div>
                    )}
                </Col>
            </Row>
            {view === 'video' && (
                <div>
                    <h2 className="text-center">Обробка відео</h2>
                    <VideoUpload onUpload={handleVideoUpload} />
                    <Row className="mt-4">
                        <Col md={6}>
                            <h3 className="text-center">Оригінальне відео</h3>
                            <OriginalVideo videoUrl={originalVideo} />
                        </Col>
                        <Col md={6}>
                            <h3 className="text-center">Оброблене відео</h3>
                            <ProcessedVideo />
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col>
                            <h3 className="text-center">Таблиця підрахунків</h3>
                            <ObjectCountsTable objectCounts={objectCounts} loading={loading} />
                        </Col>
                    </Row>
                </div>
            )}
            {view === 'image' && (
                <div>
                    <h2 className="text-center">Обробка зображення</h2>
                    <ImageUpload onUpload={handleImageUpload} />
                    <Row className="mt-4">
                        <Col md={6}>
                            <h3 className="text-center">Оригінальне зображення</h3>
                            <OriginalImage imageUrl={originalImage} />
                        </Col>
                        <Col md={6}>
                            <h3 className="text-center">Оброблене зображення</h3>
                            <ProcessedImage />
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col>
                            <h3 className="text-center">Таблиця підрахунків</h3>
                            <ObjectCountsTable objectCounts={objectCounts} loading={loading} />
                        </Col>
                    </Row>
                </div>
            )}
        </Container>
    );
};

export default HomePage;
