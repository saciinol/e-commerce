import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface LoadingSpinnerProps {
  size?: number,
  className?: string,
}

const LoadingSpinner = ({size = 12, className = ''}: LoadingSpinnerProps) => {
  return (
     <ArrowPathIcon
      style={{ width: size, height: size }}
      className={`animate-spin text-current ${className}`}
    />
  )
}

export default LoadingSpinner;
