export interface User {
	id: number;
	email: string;
	name: string | null;
	role: string;
}

export interface RegisterCredentials {
	email: string;
	name?: string;
	password: string;
	password_confirmation: string;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface AuthResponse {
	success: boolean;
	data: {
		accessToken: string;
		user: User;
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
