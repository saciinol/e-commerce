import { create } from 'zustand';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../utils/errorHandler';
import { Clickable } from '../components/ui/Toast';

interface ToastStore {
	showSuccess: (message: string, dismissOnClick?: boolean) => void;
	showError: (error: unknown, dismissOnClick?: boolean) => void;
	showLoading: (message: string) => string;
	dismissLoading: (toastId: string) => void;
}

export const useToastStore = create<ToastStore>(() => ({
	showSuccess: (message, dismissOnClick = true) => {
		toast.success((t) => (
			<Clickable id={t.id} dismissOnClick={dismissOnClick}>
				{message}
			</Clickable>
		));
	},

	showError: (error, dismissOnClick = true) => {
		const message = getErrorMessage(error);

		toast.error((t) => (
			<Clickable id={t.id} dismissOnClick={dismissOnClick}>
				{message}
			</Clickable>
		));
	},

	showLoading: (message) => {
		return toast.loading(message);
	},

	dismissLoading: (toastId) => {
		toast.dismiss(toastId);
	},
}));
