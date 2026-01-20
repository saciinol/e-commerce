import { create } from 'zustand';
import { getErrorMessage } from '../utils/errorHandler';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
	id: string;
	type: ToastType;
	message: string;
}

interface ToastStore {
	toasts: Toast[];
	actions: {
		showToast: (type: ToastType, message: string, duration?: number) => void;
		hideToast: (id: string) => void;
		showError: (error: unknown) => void;
		showSuccess: (message: string) => void;
	};
}

const useToastStore = create<ToastStore>((set, get) => ({
	toasts: [],

	actions: {
		showToast: (type, message, duration = 5000) => {
			const id = Math.random().toString(36).substring(7);

			set((state) => ({
				toasts: [...state.toasts, { id, type, message }],
			}));

			if (duration > 0) {
				setTimeout(() => get().actions.hideToast(id), duration);
			}
		},

		hideToast: (id) => {
			set((state) => ({
				toasts: state.toasts.filter((toast) => toast.id !== id),
			}));
		},

		showError: (error) => {
			const message = getErrorMessage(error);
			get().actions.showToast('error', message);
		},

		showSuccess: (message) => {
			get().actions.showToast('success', message);
		},
	},
}));

export const useToasts = () => useToastStore((state) => state.toasts);
export const useToastActions = () => useToastStore((state) => state.actions);
