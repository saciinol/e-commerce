import { forwardRef, type InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
	({ label, error, className = '', ...props }, ref) => {
		return (
			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

				<input
					ref={ref}
					className={`
          w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
          ${className}
        `}
					{...props}
				/>

				{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
			</div>
		);
	},
);

FormInput.displayName = 'FormInput';
