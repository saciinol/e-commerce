import { AxiosError } from 'axios';
import { ZodError } from 'zod';
import type { ApiError } from '../types/auth.types';

export const getErrorMessage = (error: unknown): string => {
	if (error instanceof ZodError) {
		return error.issues[0]?.message || 'Validation failed';
	}

	if (error && typeof error === 'object' && 'response' in error) {
		const axiosError = error as AxiosError<ApiError>;

		if (axiosError.response?.data?.message) {
			return axiosError.response.data.message;
		}

		switch (axiosError.response?.status) {
			case 400:
				return 'Invalid Request';
			case 401:
				return 'Authentication required';
			case 403:
				return 'Permission denied';
			case 404:
				return 'Resource not found';
			case 422:
				return 'Validation failed';
			case 429:
				return 'Too many requests';
			case 500:
				return 'Server error';
			default:
				return 'An error occured';
		}
	}

	if (error && typeof error === 'object' && 'request' in error) {
		return 'Network error. Check your connection';
	}

	if (error instanceof Error) return error.message;
	if (typeof error === 'string') return error;

	return 'An unexpected error occured';
};

export const getValidationErrors = (error: unknown): Record<string, string> => {
	if (error && typeof error === 'object' && 'response' in error) {
		const axiosError = error as AxiosError<ApiError>;
		const errors = axiosError.response?.data?.errors;

		if (errors) {
			return Object.entries(errors).reduce(
				(acc, [key, messages]) => {
					acc[key] = Array.isArray(messages) ? messages[0] : messages;
					return acc;
				},
				{} as Record<string, string>,
			);
		}
	}

	return {};
};
