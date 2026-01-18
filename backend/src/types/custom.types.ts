export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

export interface RefreshTokenData {
  userId: number;
  deviceInfo?: string;
  ipAddress?: string;
}
