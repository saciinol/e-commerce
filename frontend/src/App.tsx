import React, { useEffect } from 'react';
import { Navigate, useLocation, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthActions, useAuthenticated, useInitialized } from './store/auth.store';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Login from './pages/Login';
import Home from './pages/Home';

interface ProviderProps {
	children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProviderProps) => {
	const isAuthenticated = useAuthenticated();
	const location = useLocation();

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return children;
};

const PublicRoute = ({ children }: ProviderProps) => {
	const isAuthenticated = useAuthenticated();

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return children;
};

const App = () => {
	const { checkAuth } = useAuthActions();
	const isInitialized = useInitialized();

	useEffect(() => {
		checkAuth();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!isInitialized) {
		return (
			<div className="min-h-screen flex justify-center items-center">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<Router>
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
					path="/"
					element={
						<ProtectedRoute>
							<Home />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</Router>
	);
};

export default App;
