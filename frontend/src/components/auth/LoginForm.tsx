import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../../store/auth.store';
import type { useToastActions } from '../../store/toast.store';
import { loginSchema, type LoginInput } from '../../schemas/auth.schema';
import { getValidationErrors } from '../../utils/errorHandler';

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
		defaultValues: {
			email: '',
			password: '',
		},
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

	return <div></div>;
};

export default LoginForm;
