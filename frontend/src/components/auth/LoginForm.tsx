import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../../store/auth.store';
import { useToastActions } from '../../store/toast.store';
import { loginSchema, type LoginInput } from '../../schemas/auth.schema';
import { getValidationErrors } from '../../utils/errorHandler';
import { FormInput } from '../ui/FormInput';

const LoginForm = () => {
	const navigate = useNavigate();
	const { login } = useAuthActions();
	const { showSuccess, showError } = useToastActions();

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
			navigate('/');
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

			<FormInput type="password" placeholder="Password" error={errors.password?.message} {...register('password')} />

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
