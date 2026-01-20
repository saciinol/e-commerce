import React, { lazy, Suspense, useEffect } from 'react';
import { Navigate, useLocation, Routes, Route } from 'react-router-dom';
import { useAuthActions, useAuthenticated, useInitialized } from './store/auth.store';
import { PageLoader } from './components/ui/LoadingSpinner';
import ScrollToTop from './components/ui/ScrollToTop';
import { ToastContainer } from './components/ui/Toast';

const Login = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/Home'));

// interface ProviderProps {
// 	children: React.ReactNode;
// }

// const ProtectedRoute = ({ children }: ProviderProps) => {
// 	const isAuthenticated = useAuthenticated();
// 	const location = useLocation();

// 	if (!isAuthenticated) {
// 		return <Navigate to="/login" state={{ from: location }} replace />;
// 	}

// 	return <>{children}</>;
// };

// const PublicRoute = ({ children }: ProviderProps) => {
// 	const isAuthenticated = useAuthenticated();

// 	if (isAuthenticated) {
// 		return <Navigate to="/" replace />;
// 	}

// 	return <>{children}</>;
// };

const App = () => {
	const { restoreSession } = useAuthActions();
	const isInitialized = useInitialized();

	useEffect(() => {
		restoreSession();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!isInitialized) {
		return <PageLoader />;
	}

	return (
		<Suspense fallback={<PageLoader />}>
			<ScrollToTop />

			<ToastContainer />

			<Routes>
				<Route
					path="/login"
					element={
						// <PublicRoute>
						<Login />
						// </PublicRoute>
					}
				/>

				<Route
					path="/"
					element={
						// <ProtectedRoute>
						<Home />
						// </ProtectedRoute>
					}
				/>
			</Routes>
		</Suspense>
	);
};

export default App;
