import { forwardRef, type InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
	error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
	({ error, className = '', ...props }, ref) => {
		return (
			<div className="mb-4">
				<input
					ref={ref}
					className={`
          w-full px-3 py-2 border rounded-lg text-text-primary focus:outline-none focus:ring-2
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-border-primary focus:ring-blue-500'}
          ${className}
        `}
					{...props}
				/>

				{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
			</div>
		);
	},
);

FormInput.displayName = 'FormInput';
