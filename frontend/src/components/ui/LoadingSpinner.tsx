export const LoadingSpinner = () => {
	return <div className="loading-spinner" />;
};

export const PageLoader = () => {
	return (
		<div className="min-h-screen flex justify-center items-center">
			<div className="loading-spinner" />
		</div>
	);
};
