import { Laptop, Moon, Sun } from 'lucide-react';
import { useSetTheme, useTheme } from '../../store/theme.store';
import Dropdown, { DropdownItem } from './Dropdown';

const ThemeToggle = () => {
	const theme = useTheme();
	const setTheme = useSetTheme();
	return (
		<Dropdown
			className="min-w-20! border border-text-primary/10"
			trigger={
				<div className="border-text-primary">
					{theme === 'light' ? (
						<Sun className="size-6" />
					) : theme === 'dark' ? (
						<Moon className="size-6" />
					) : (
						theme === 'system' && <Laptop className="size-6" />
					)}
				</div>
			}
		>
			<DropdownItem onClick={() => setTheme('light')}>
				<Sun className="size-4" />
				Light
			</DropdownItem>
			<DropdownItem onClick={() => setTheme('dark')}>
				<Moon className="size-4" />
				Dark
			</DropdownItem>
			<DropdownItem onClick={() => setTheme('system')}>
				<Laptop className="size-4" />
				System
			</DropdownItem>
		</Dropdown>
	);
};

export default ThemeToggle;
