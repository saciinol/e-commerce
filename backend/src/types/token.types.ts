export interface TokenPair {
	accessToken: string;
	refreshToken: string;
}

export interface TokenPayload {
	userId: number;
	role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
}

export interface RefreshTokenData {
	userId: number;
	deviceInfo?: string;
	ipAddress?: string;
}
