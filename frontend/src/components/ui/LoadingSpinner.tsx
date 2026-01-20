import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface LoadingSpinnerProps {
	size?: number;
	className?: string;
}

export const LoadingSpinner = ({ size = 20, className = '' }: LoadingSpinnerProps) => {
	return <ArrowPathIcon style={{ width: size, height: size }} className={`animate-spin text-current ${className}`} />;
};

export const PageLoader = ({ size = 8, className = '' }: LoadingSpinnerProps) => {
	return (
		<div className="min-h-screen flex justify-center items-center">
			<ArrowPathIcon style={{ width: size, height: size }} className={`animate-spin text-current ${className}`} />
		</div>
	);
};
