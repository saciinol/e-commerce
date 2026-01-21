import { create } from 'zustand';
import type { User } from '../types';
import { clearAccessToken, setAccessToken } from '../services/api';
import { authAPI } from '../services/auth.api';
import type { LoginInput, RegisterInput } from '../schemas/auth.schema';

interface AuthStore {
	user: User | null;
	isInitialized: boolean;
	actions: {
		restoreSession: () => Promise<void>;
		login: (credentials: LoginInput) => Promise<void>;
		register: (credentials: RegisterInput) => Promise<void>;
		logout: () => Promise<void>;
	};
}

const useAuthStore = create<AuthStore>((set) => ({
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

export const useUser = () => useAuthStore((state) => state.user);
export const useInitialized = () => useAuthStore((state) => state.isInitialized);
export const useAuthenticated = () => useAuthStore((state) => !!state.user);
export const useAuthActions = () => useAuthStore((state) => state.actions);
