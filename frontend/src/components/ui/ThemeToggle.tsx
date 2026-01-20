import { useSetTheme, useTheme, type Theme } from '../../store/theme.store';

const ThemeToggle = () => {
	const theme = useTheme();
	const setTheme = useSetTheme();

	return (
		<div className="absolute top-5 right-5 z-50 border-text-primary">
			<select
				className="bg-bg-primary text-text-primary border"
				value={theme}
				onChange={(e) => setTheme(e.target.value as Theme)}
			>
				<option value="light">Light</option>
				<option value="dark">Dark</option>
				<option value="system">System</option>
			</select>
		</div>
	);
};

export default ThemeToggle;
