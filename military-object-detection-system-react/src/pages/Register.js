import React, { useState } from 'react';
import { registerUser } from '../api/authApi';
import { Form, Button, Alert, Container } from 'react-bootstrap';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    const validatePassword = (password) => {
        const passwordPattern = /^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?[\];',./`~\\-]+$/;
        return passwordPattern.test(password);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateEmail(email)) {
            setError('Invalid email format.');
            return;
        }

        if (!validatePassword(password)) {
            setError('Password can only contain English letters, numbers, and symbols.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const data = await registerUser({ email, password });
            setMessage(data.message);
            setError(null);
        } catch (err) {
            setMessage(null);
            setError('Registration failed.');
        }
    };

    return (
        <Container style={{ maxWidth: '400px', marginTop: '50px' }}>
            <h2 className="text-center">Register</h2>
            <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                    Register
                </Button>
            </Form>

            {message && (
                <Alert className="mt-3" variant="success">
                    {message}
                </Alert>
            )}

            {error && (
                <Alert className="mt-3" variant="danger">
                    {error}
                </Alert>
            )}
        </Container>
    );
};

export default Register;
