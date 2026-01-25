import React, { useEffect, useRef, useState } from 'react';

interface DropdownProps {
	trigger: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}

const Dropdown = ({ trigger, children, className = '' }: DropdownProps) => {
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (menuRef.current && e.target instanceof Node && !menuRef.current.contains(e.target)) {
				setOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div className="relative inline-block" ref={menuRef}>
			<div onClick={() => setOpen((o) => !o)} className="cursor-pointer select-none">
				{trigger}
			</div>

			{open && (
				<div
					className={`absolute right-0 mt-2 min-w-36 rounded-md bg-bg-primary shadow-md border border-bg-primary/10 ${className}`}
					onClick={() => setOpen(false)}
				>
					{children}
				</div>
			)}
		</div>
	);
};

interface DropdownItemProps {
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
}

export const DropdownItem = ({ children, onClick, className = '' }: DropdownItemProps) => {
	return (
		<button
			className={`w-full flex items-center gap-2 text-left px-2.5 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-[#1b2027] duration-100 cursor-pointer ${className}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default Dropdown;
