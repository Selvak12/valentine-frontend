import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import * as AuthTypes from '../../types/auth'; // Import all as namespace
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../../services/api/authService';

// Initial state
const initialState: AuthTypes.AuthState = {
    user: null,
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
};

// Async Thunks
export const login = createAsyncThunk<AuthTypes.AuthResponse, AuthTypes.LoginCredentials>(
    'auth/login',
    async (credentials: AuthTypes.LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await apiLogin(credentials);
            localStorage.setItem('token', response.token);
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
            }
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const register = createAsyncThunk<AuthTypes.AuthResponse, AuthTypes.RegisterData>(
    'auth/register',
    async (userData: AuthTypes.RegisterData, { rejectWithValue }) => {
        try {
            const response = await apiRegister(userData);
            localStorage.setItem('token', response.token);
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
            }
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await apiLogout();
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        } catch (error: any) {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthTokens: (state, action: PayloadAction<{ token: string; refreshToken?: string }>) => {
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('token', action.payload.token);
            if (action.payload.refreshToken) {
                state.refreshToken = action.payload.refreshToken;
                localStorage.setItem('refreshToken', action.payload.refreshToken);
            }
        },
        clearAuth: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<AuthTypes.AuthResponse>) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken || null;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.error = (action.payload as string) || 'Login failed';
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action: PayloadAction<AuthTypes.AuthResponse>) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken || null;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.error = (action.payload as string) || 'Registration failed';
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.error = (action.payload as string) || 'Logout failed, but session cleared locally.';
            });
    },
});

export const { setAuthTokens, clearAuth } = authSlice.actions;

export default authSlice.reducer;
