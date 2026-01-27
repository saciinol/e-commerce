export type Role = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
	id: number;
	email: string;
	firstName: string | null;
	lastName: string | null;
	role: Role;
}

export interface AuthResponse {
	success: boolean;
	data: {
		accessToken: string;
		user: User;
	};
}

export interface AdminAuthResponse {
	success: boolean;
	data: {
		admin: User;
	};
}

export interface LogoutResponse {
	success: boolean;
	message: string;
}

export interface SessionsResponse {
	success: boolean;
	data: {
		sessions: {
			createdAt: Date;
			id: number;
			deviceInfo: string | null;
			ipAddress: string | null;
			lastUsedAt: Date;
		}[];
	};
}

export interface ApiError {
	status: string;
	message: string;
	errors?: Record<string, string[]>;
	code?: string;
}
