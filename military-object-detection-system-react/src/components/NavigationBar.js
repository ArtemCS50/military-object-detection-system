import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavigationBar = () => {
    const { authToken, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="light" expand="lg" className="mb-3">
            <Navbar.Brand href="/">Головна</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                    {!authToken ? (
                        <>
                            <Nav.Link href="/login">Вхід</Nav.Link>
                            <Nav.Link href="/register">Реєстрація</Nav.Link>
                        </>
                    ) : (
                        <Button variant="outline-danger" onClick={handleLogout}>
                            Вийти
                        </Button>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationBar;
