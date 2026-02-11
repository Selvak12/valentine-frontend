import axios from 'axios';
import { store } from '../../store/store';
import { clearAuth } from '../../store/slices/authSlice';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        // If unauthorized or invalid token, clear auth and redirect to login
        if (error.response?.status === 401 || error.response?.data?.error?.includes('Invalid token')) {
            store.dispatch(clearAuth());
            alert('⏱️ Your session has expired. Please log in again.');
            window.location.href = '/#/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
