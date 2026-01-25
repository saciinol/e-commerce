export interface TokenPair {
	accessToken: string;
	refreshToken: string;
}

export interface TokenPayload {
	userId: number;
	email: string;
	role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface refreshPayload extends TokenPayload {
	firstName: string | null;
	lastName: string | null;
}

export interface RefreshTokenData {
	userId: number;
	deviceInfo?: string;
	ipAddress?: string;
}

export interface ReqUser {
	id: number;
	email: string;
	role: string;
}
