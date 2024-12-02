import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
    const [isTokenValid, setIsTokenValid] = useState(true); // Додаємо стан для перевірки токена

    useEffect(() => {
        const validateToken = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No token found');

                const response = await fetch('/api/auth/validate', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error('Token is invalid');
                setIsTokenValid(true);
            } catch (error) {
                logout(); // Видаляємо токен
                setIsTokenValid(false);
            }
        };

        validateToken();
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        setAuthToken(token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
    };

    const isAuthenticated = () => !!authToken && isTokenValid;

    return (
        <AuthContext.Provider value={{ authToken, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
