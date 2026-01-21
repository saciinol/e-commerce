import toast, { Toaster } from 'react-hot-toast';

export const Clickable = ({
	id,
	children,
	dismissOnClick = true,
}: {
	id: string;
	children: React.ReactNode;
	dismissOnClick?: boolean;
}) => (
	<div onClick={() => dismissOnClick && toast.dismiss(id)} style={{ cursor: dismissOnClick ? 'pointer' : 'default' }}>
		{children}
	</div>
);

export const Toast = () => {
	return (
		<Toaster
			position="top-right"
			toastOptions={{
				duration: 4000,
				style: {
					background: 'var(--color-bg-secondary)',
					color: 'var(--color-text-primary)',
				},
				success: {
					duration: 3000,
					iconTheme: {
						primary: '#10b981',
						secondary: '#fff',
					},
				},
				error: {
					duration: 4000,
					iconTheme: {
						primary: '#ef4444',
						secondary: '#fff',
					},
				},
			}}
		/>
	);
};
