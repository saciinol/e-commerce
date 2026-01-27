import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../../store/auth.store';
import { useToastStore } from '../../store/toast.store';
import { useForm } from 'react-hook-form';
import { registerSchema, type RegisterInput } from '../../schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { getValidationErrors } from '../../utils/errorHandler';
import { FormInput } from '../ui/FormInput';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const RegisterForm = () => {
	const navigate = useNavigate();
	const { register } = useAuthActions();
	const { showSuccess, showError } = useToastStore();
	const [showPW, setShowPW] = useState(false);
	const [showConfirmPW, setShowConfirmPW] = useState(false);

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
			<div className="flex gap-2">
				<FormInput
					type="text"
					placeholder="First Name"
					error={errors.firstName?.message}
					{...registerField('firstName')}
				/>

				<FormInput
					type="text"
					placeholder="Last Name"
					error={errors.lastName?.message}
					{...registerField('lastName')}
				/>
			</div>

			<FormInput type="email" placeholder="Email" error={errors.email?.message} {...registerField('email')} />

			<div className="relative">
				<FormInput
					type={showPW ? 'text' : 'password'}
					placeholder="Password"
					error={errors.password?.message}
					className="pr-12!"
					{...registerField('password')}
				/>
				<button
					type="button"
					onClick={() => setShowPW(!showPW)}
					className={`absolute right-2 transform rounded-full text-text-primary hover:bg-bg-thirdy p-1.5 cursor-pointer ${errors.password?.message ? 'top-3 -translate-y-1' : 'top-1/2 -translate-y-1/2'}`}
				>
					{showPW ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
				</button>
			</div>

			<div className="relative">
				<FormInput
					type={showConfirmPW ? 'text' : 'password'}
					placeholder="Confirm Password"
					error={errors.password_confirmation?.message}
					className="pr-12!"
					{...registerField('password_confirmation')}
				/>
				<button
					type="button"
					onClick={() => setShowConfirmPW(!showConfirmPW)}
					className={`absolute right-2 transform rounded-full text-text-primary hover:bg-bg-thirdy p-1.5 cursor-pointer ${errors.password_confirmation?.message ? 'top-3 -translate-y-1' : 'top-1/2 -translate-y-1/2'}`}
				>
					{showConfirmPW ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
				</button>
			</div>

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
