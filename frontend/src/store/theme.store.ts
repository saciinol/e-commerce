import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const useThemeStore = create<ThemeStore>()(
	persist(
		(set) => ({
			theme: 'system',
			setTheme: (theme) => set({ theme }),
		}),
		{
			name: 'theme', // localStorage key
		},
	),
);

export const useTheme = () => useThemeStore((state) => state.theme);
export const useSetTheme = () => useThemeStore((state) => state.setTheme);
