import type { LoginInput, RegisterInput } from '../schemas/auth.schema';
import type { AuthResponse, LogoutResponse, SessionsResponse } from '../types';
import api from './api';

export const authAPI = {
	login: (data: LoginInput) =>
		api.post<AuthResponse>('/auth/login', data, {
			_skipAuthRefresh: true,
		}),
	register: (data: RegisterInput) =>
		api.post<AuthResponse>('/auth/register', data, {
			_skipAuthRefresh: true,
		}),
	refresh: () =>
		api.post<AuthResponse>('/auth/refresh', {}, {
      _skipAuthRefresh: true, //
    }),
	logout: () => api.post<LogoutResponse>('/auth/logout'),
	logoutAll: () => api.post<LogoutResponse>('/auth/logout-all'),
	sessions: () => api.get<SessionsResponse>('/auth/sessions'),
};
