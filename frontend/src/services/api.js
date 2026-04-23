import axios from 'axios';

const API_BASE = 'http://localhost:5005/api';

// Create an axios instance to include the token in headers if it exists
const api = axios.create({
    baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const analyzeData = async (formData) => {
    try {
        const response = await api.post(`/analyze`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Analysis failed");
    }
};

export const getHistory = async () => {
    try {
        const response = await api.get(`/history`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Failed to fetch history");
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await api.post(`/auth/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Login failed");
    }
};

export const signupUser = async (userData) => {
    try {
        const response = await api.post(`/auth/signup`, userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Signup failed");
    }
};

export default api;
