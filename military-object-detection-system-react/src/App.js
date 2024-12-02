import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/HomePage';
import Navbar from './components/NavigationBar';

const App = () => (
    <AuthProvider>
        <Router>
            <Navbar /> {}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    </AuthProvider>
);

export default App;
