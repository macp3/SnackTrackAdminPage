import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('jwtToken'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    const login = async (email, password) => {
        try {
            const response = await api.post('/admin-auth/login', { email, password });
            
            const receivedToken = response.data;

            localStorage.setItem('jwtToken', receivedToken);
            setToken(receivedToken);
            setIsAuthenticated(true);
            
            return true; // Sukces
        } catch (error) {
            console.error("Login failed:", error);
            return false; // Błąd logowania
        }
    };

    const logout = () => {
        localStorage.removeItem('jwtToken');
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);