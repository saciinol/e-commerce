import { create } from 'zustand';
import type { LoginCredentials, RegisterCredentials, User } from '../types';
import { clearAccessToken, setAccessToken } from '../services/api';
import { authAPI } from '../services/auth.api';

interface useAuthStoreTypes {
	user: User | null;
	isLoading: boolean;
	actions: {
		checkAuth: () => Promise<void>;
		register: (credentials: RegisterCredentials) => Promise<void>;
		login: (credentials: LoginCredentials) => Promise<void>;
		logout: () => Promise<void>;
	};
}

const useAuthStore = create<useAuthStoreTypes>((set, get) => ({
	user: null,
	isLoading: false,
	actions: {
		checkAuth: async () => {
			set({ isLoading: true });

			try {
				const response = await authAPI.checkAuth();
				setAccessToken(response.data.data.accessToken);
				set({
					user: response.data.data.user,
				});
			} catch {
				get().actions.logout();
			} finally {
				set({ isLoading: false });
			}
		},

		register: async (credentials: RegisterCredentials) => {
			set({ isLoading: true });

			try {
				const response = await authAPI.register(credentials);
				const { accessToken, user } = response.data.data;

				setAccessToken(accessToken);
				set({ user });
			} catch (error) {
				console.error(error);
			} finally {
				set({ isLoading: false });
			}
		},

		login: async (credentials: LoginCredentials) => {
			set({ isLoading: true });

			try {
				const response = await authAPI.login(credentials);
				const { accessToken, user } = response.data.data;

				setAccessToken(accessToken);
				set({ user });
			} catch (error) {
				console.error(error);
			} finally {
				set({ isLoading: false });
			}
		},

		logout: async () => {
			set({ isLoading: true });

			try {
				await authAPI.logout();
				clearAccessToken();
				set({ user: null });
			} catch (error) {
				console.error(error);
			} finally {
				set({ isLoading: false });
			}
		},
	},
}));

export const useUser = () => useAuthStore((state) => state.user);
