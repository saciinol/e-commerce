import React, { lazy, Suspense, useEffect } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuthActions, useAuthAuthenticated, useAuthInitialized, useAuthUser } from './store/auth.store';
import { PageLoader } from './components/ui/LoadingSpinner';
import ScrollToTop from './components/ui/ScrollToTop';
import { Toast } from './components/ui/Toast';
import { useApplyTheme } from './hooks/useApplyTheme';
import AdminRegister from './pages/AdminRegister';
import Layout from './components/ui/Layout';
import ImageUploadTest from './components/product/ImageUploadTest';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Home = lazy(() => import('./pages/Home'));
const Product = lazy(() => import('./pages/Product'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

interface ProviderProps {
	children: React.ReactNode;
}

const PublicRoute = ({ children }: ProviderProps) => {
	const isAuthenticated = useAuthAuthenticated();
	const user = useAuthUser();

	if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
		return <Navigate to="/admin" replace />;
	}

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
};

const AdminRoute = ({ children }: ProviderProps) => {
	const isAuthenticated = useAuthAuthenticated();
	const user = useAuthUser();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
};

const SuperAdminRoute = ({ children }: ProviderProps) => {
	const isAuthenticated = useAuthAuthenticated();
	const user = useAuthUser();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	if (user?.role === 'ADMIN') {
		return <Navigate to="/admin" replace />;
	}

	if (user?.role !== 'SUPER_ADMIN') {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
};

const App = () => {
	useApplyTheme();

	const { restoreSession } = useAuthActions();
	const isInitialized = useAuthInitialized();

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

			<Routes>
				<Route path="/upload" element={<ImageUploadTest />} />

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

				<Route
					path="/admin/register"
					element={
						<SuperAdminRoute>
							<AdminRegister />
						</SuperAdminRoute>
					}
				/>

				<Route
					path="/"
					element={
						<Layout>
							<Home />
						</Layout>
					}
				/>

				<Route
					path="/products/:id"
					element={
						<Layout isProduct={true}>
							<Product />
						</Layout>
					}
				/>

				<Route
					path="/admin"
					element={
						<AdminRoute>
							<Dashboard />
						</AdminRoute>
					}
				/>

				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</Suspense>
	);
};

export default App;
