import { create } from 'zustand';
import type { User } from '../types/auth.types';
import { clearAccessToken, setAccessToken } from '../services/api.service';
import { authAPI } from '../services/auth.service';
import type { LoginInput, RegisterInput } from '../schemas/auth.schema';

interface AuthStore {
	user: User | null;
	isInitialized: boolean;
	actions: {
		restoreSession: () => Promise<void>;
		adminRegister: (credentials: RegisterInput) => void;
		login: (credentials: LoginInput) => Promise<void>;
		register: (credentials: RegisterInput) => Promise<void>;
		logout: () => Promise<void>;
	};
}

export const useAuthStore = create<AuthStore>((set) => ({
	user: null,
	isInitialized: false,

	actions: {
		restoreSession: async () => {
			try {
				const response = await authAPI.refresh();
				const { accessToken, user } = response.data.data;

				setAccessToken(accessToken);
				set({ user });
			} catch {
				clearAccessToken();
				set({ user: null });
			} finally {
				set({ isInitialized: true });
			}
		},

		adminRegister: (credentials: RegisterInput) => {
			authAPI.adminRegister(credentials);
		},

		login: async (credentials: LoginInput) => {
			const response = await authAPI.login(credentials);
			const { accessToken, user } = response.data.data;

			setAccessToken(accessToken);
			set({ user });
		},

		register: async (credentials: RegisterInput) => {
			const response = await authAPI.register(credentials);
			const { accessToken, user } = response.data.data;

			setAccessToken(accessToken);
			set({ user });
		},

		logout: async () => {
			try {
				await authAPI.logout();
			} finally {
				clearAccessToken();
				set({ user: null });
			}
		},
	},
}));

export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthInitialized = () => useAuthStore((state) => state.isInitialized);
export const useAuthAuthenticated = () => useAuthStore((state) => !!state.user);
export const useAuthActions = () => useAuthStore((state) => state.actions);
