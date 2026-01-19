import type {
	AuthResponse,
	LoginCredentials,
	LogoutResponse,
	RegisterCredentials,
	SessionsResponse,
} from '../types/auth.types';
import api from './api';

export const authAPI = {
	register: (data: RegisterCredentials) => api.post<AuthResponse>('/auth/register', data),
	login: (data: LoginCredentials) => api.post<AuthResponse>('/auth/login', data),
	logout: () => api.post<LogoutResponse>('/auth/logout'),
	logoutAll: () => api.post<LogoutResponse>('/auth/logout-all'),
	sessions: () => api.get<SessionsResponse>('/auth/sessions'),
	checkAuth: () => api.post<AuthResponse>('/auth/refresh'),
};
