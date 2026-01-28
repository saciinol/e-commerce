import type { LoginInput, RegisterInput } from '../schemas/auth.schema';
import type { AdminAuthResponse, AuthResponse, LogoutResponse, SessionsResponse } from '../types/auth.types';
import api from './api.service';

export const authAPI = {
	adminRegister: (data: RegisterInput) => api.post<AdminAuthResponse>('/admin/register', data),

	login: (data: LoginInput) =>
		api.post<AuthResponse>('/auth/login', data, {
			_skipAuthRefresh: true,
		}),
	register: (data: RegisterInput) =>
		api.post<AuthResponse>('/auth/register', data, {
			_skipAuthRefresh: true,
		}),
	refresh: () =>
		api.post<AuthResponse>(
			'/auth/refresh',
			{},
			{
				_skipAuthRefresh: true, //
			},
		),
	logout: () => api.post<LogoutResponse>('/auth/logout'),
	logoutAll: () => api.post<LogoutResponse>('/auth/logout-all'),
	sessions: () => api.get<SessionsResponse>('/auth/sessions'),
};
