import { create } from 'zustand';
import type { User } from '../types/auth.types';
import { clearAccessToken, setAccessToken } from '../services/api';
import { authAPI } from '../services/auth.api';
import type { LoginInput, RegisterInput } from '../schemas/auth.schema';

interface useAuthStoreTypes {
	user: User | null;
	isLoading: boolean;
	isInitialized: boolean;
	actions: {
		checkAuth: () => Promise<void>;
		register: (credentials: RegisterInput) => Promise<void>;
		login: (credentials: LoginInput) => Promise<void>;
		logout: () => Promise<void>;
	};
}

const useAuthStore = create<useAuthStoreTypes>((set) => ({
	user: null,
	isLoading: false,
	isInitialized: false,
	actions: {
		checkAuth: async () => {
			try {
				const response = await authAPI.checkAuth();
				setAccessToken(response.data.data.accessToken);
				set({
					user: response.data.data.user,
				});
			} catch {
				clearAccessToken();
				set({
					user: null,
				});
			} finally {
				set({ isInitialized: true });
			}
		},

		register: async (credentials: RegisterInput) => {
			set({ isLoading: true });

			try {
				const response = await authAPI.register(credentials);
				const { accessToken, user } = response.data.data;

				setAccessToken(accessToken);
				set({
					user,
				});
			} catch (error) {
				console.error('Register failed', error);
				throw error;
			} finally {
				set({ isLoading: false });
			}
		},

		login: async (credentials: LoginInput) => {
			set({ isLoading: true });

			try {
				const response = await authAPI.login(credentials);
				const { accessToken, user } = response.data.data;

				setAccessToken(accessToken);
				set({
					user,
				});
			} catch (error) {
				console.error('Login failed', error);
				throw error;
			} finally {
				set({ isLoading: false });
			}
		},

		logout: async () => {
			set({ isLoading: true });

			try {
				await authAPI.logout();
				clearAccessToken();
				set({
					user: null,
				});
			} catch (error) {
				console.error('Logout failed', error);
				throw error;
			} finally {
				set({ isLoading: false });
			}
		},
	},
}));

export const useUser = () => useAuthStore((state) => state.user);
export const useLoading = () => useAuthStore((state) => state.isLoading);
export const useInitialized = () => useAuthStore((state) => state.isInitialized);
export const useAuthenticated = () => useAuthStore((state) => !!state.user);
export const useAuthActions = () => useAuthStore((state) => state.actions);
