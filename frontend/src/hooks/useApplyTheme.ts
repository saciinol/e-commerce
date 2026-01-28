import { useEffect } from 'react';
import { useTheme } from '../store/theme.store';

export const useApplyTheme = () => {
	const theme = useTheme();
	useEffect(() => {
		const root = document.documentElement;

		const apply = (isDark: boolean) => {
			root.dataset.theme = isDark ? 'dark' : 'light';
		};

		if (theme === 'system') {
			const mq = window.matchMedia('(prefers-color-scheme: dark)');
			apply(mq.matches);

			const listener = (e: MediaQueryListEvent) => apply(e.matches);
			mq.addEventListener('change', listener);

			return () => mq.removeEventListener('change', listener);
		}

		apply(theme === 'dark');
	}, [theme]);
};
