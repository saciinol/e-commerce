import type { LoginInput, RegisterInput } from '../schemas/auth.schema';
import type {
	AuthResponse,
	LogoutResponse,
	SessionsResponse,
} from '../types/auth.types';
import api from './api';

export const authAPI = {
	register: (data: RegisterInput) => api.post<AuthResponse>('/auth/register', data),
	login: (data: LoginInput) => api.post<AuthResponse>('/auth/login', data),
	logout: () => api.post<LogoutResponse>('/auth/logout'),
	logoutAll: () => api.post<LogoutResponse>('/auth/logout-all'),
	sessions: () => api.get<SessionsResponse>('/auth/sessions'),
	checkAuth: () => api.post<AuthResponse>('/auth/refresh'),
};
