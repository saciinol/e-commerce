import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthActions } from '../../store/auth.store';
import { useToastStore } from '../../store/toast.store';
import { loginSchema, type LoginInput } from '../../schemas/auth.schema';
import { getValidationErrors } from '../../utils/errorHandler';
import { FormInput } from '../ui/FormInput';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const LoginForm = () => {
	const { login } = useAuthActions();
	const { showSuccess, showError } = useToastStore();
	const [showPW, setShowPW] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginInput) => {
		try {
			await login(data);
			showSuccess('Login successful!');
		} catch (error) {
			const validationErrors = getValidationErrors(error);

			if (Object.keys(validationErrors).length > 0) {
				// set field-specific errors
				Object.entries(validationErrors).forEach(([field, message]) => {
					setError(field as keyof LoginInput, {
						type: 'server',
						message,
					});
				});
			} else {
				showError(error);
			}
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FormInput type="email" placeholder="Email" error={errors.email?.message} {...register('email')} />

			<div className="relative">
				<FormInput
					type={showPW ? 'text' : 'password'}
					placeholder="Password"
					error={errors.password?.message}
					className="pr-12!"
					{...register('password')}
				/>
				<button
					type="button"
					onClick={() => setShowPW(!showPW)}
					className={`absolute right-2 transform rounded-full text-text-primary hover:bg-bg-thirdy p-1.5 cursor-pointer ${errors.password?.message ? 'top-3 -translate-y-1' : 'top-1/2 -translate-y-1/2'}`}
				>
					{showPW ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
				</button>
			</div>

			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full mt-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isSubmitting ? 'Logging in...' : 'Login'}
			</button>
		</form>
	);
};

export default LoginForm;
