import apiClient from './client';
import * as AuthTypes from '../../types/auth';

export const login = async (credentials: AuthTypes.LoginCredentials): Promise<AuthTypes.AuthResponse> => {
    const response = await apiClient.post<{ success: boolean; data: AuthTypes.AuthResponse }>('/auth/login', credentials);
    // Backend returns {success: true, data: {user, token, refreshToken}}
    return response.data.data;
};

export const register = async (userData: AuthTypes.RegisterData): Promise<AuthTypes.AuthResponse> => {
    const response = await apiClient.post<{ success: boolean; data: AuthTypes.AuthResponse }>('/auth/register', userData);
    // Backend returns {success: true, data: {user, token, refreshToken}}
    return response.data.data;
};

export const logout = async (): Promise<void> => {
    await apiClient.post('/auth/logout');
};

export const refreshToken = async (): Promise<{ token: string; refreshToken: string }> => {
    const response = await apiClient.post<{ token: string; refreshToken: string }>('/auth/refresh');
    return response.data;
};
