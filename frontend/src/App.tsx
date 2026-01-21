import React, { lazy, Suspense, useEffect } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuthActions, useAuthenticated, useInitialized } from './store/auth.store';
import { PageLoader } from './components/ui/LoadingSpinner';
import ScrollToTop from './components/ui/ScrollToTop';
import { Toast } from './components/ui/Toast';
import { useApplyTheme } from './components/hooks/useApplyTheme';
import ThemeToggle from './components/ui/ThemeToggle';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));

interface ProviderProps {
	children: React.ReactNode;
}

const PublicRoute = ({ children }: ProviderProps) => {
	const isAuthenticated = useAuthenticated();

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
};

const App = () => {
	useApplyTheme();

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

      <Toast />

			<ThemeToggle />

			<Routes>
				<Route
					path="/login"
					element={
						<PublicRoute>
							<Login />
						</PublicRoute>
					}
				/>

				<Route
					path="/register"
					element={
						<PublicRoute>
							<Register />
						</PublicRoute>
					}
				/>

				<Route path="/" element={<Home />} />

				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</Suspense>
	);
};

export default App;
