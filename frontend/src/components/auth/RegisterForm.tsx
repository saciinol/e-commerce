import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../../store/auth.store';
import { useToastStore } from '../../store/toast.store';
import { useForm } from 'react-hook-form';
import { registerSchema, type RegisterInput } from '../../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { getValidationErrors } from '../../utils/errorHandler';
import { FormInput } from '../ui/FormInput';

const RegisterForm = () => {
	const navigate = useNavigate();
	const { register } = useAuthActions();
	const { showSuccess, showError } = useToastStore();

	const {
		register: registerField,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
	});

	const onSubmit = async (data: RegisterInput) => {
		try {
			await register(data);
			showSuccess('Register successful!');
			navigate('/');
		} catch (error) {
			const validationErrors = getValidationErrors(error);

			if (Object.keys(validationErrors).length > 0) {
				// set field-specific errors
				Object.entries(validationErrors).forEach(([field, message]) => {
					setError(field as keyof RegisterInput, {
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
			<FormInput type="email" placeholder="Email" error={errors.email?.message} {...registerField('email')} />

			<FormInput type="text" placeholder="Name" error={errors.name?.message} {...registerField('name')} />

			<FormInput
				type="password"
				placeholder="Password"
				error={errors.password?.message}
				{...registerField('password')}
			/>

			<FormInput
				type="password"
				placeholder="Confirm Password"
				error={errors.password_confirmation?.message}
				{...registerField('password_confirmation')}
			/>

			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full mt-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isSubmitting ? 'Registering...' : 'Register'}
			</button>
		</form>
	);
};

export default RegisterForm;
