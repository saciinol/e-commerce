import { useToastActions, useToasts } from '../../store/toast.store';

export const ToastContainer = () => {
	const toasts = useToasts();
	const { hideToast } = useToastActions();

	if (toasts.length === 0) return null;

	return (
		<div className="fixed top-4 right-4 z-50 space-y-2">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className={`
          px-4 py-3 rounded-lg shadow-lg min-w-60 max-w-md
        flex items-center justify-between animate-slide-in
        ${toast.type === 'success' && 'bg-green-500 text-white'}
        ${toast.type === 'error' && 'bg-red-500 text-white'}
        ${toast.type === 'warning' && 'bg-yellow-500 text-white'}
        ${toast.type === 'info' && 'bg-blue-500 text-white'}
        `}
				>
					<span>{toast.message}</span>
					<button onClick={() => hideToast(toast.id)} className="ml-4 hover:opacity-80">
						✕
					</button>
				</div>
			))}
		</div>
	);
};
