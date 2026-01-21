import { Link, useNavigate } from 'react-router-dom';
import { useAuthActions, useAuthenticated, useUser } from '../store/auth.store';
import { useToastActions } from '../store/toast.store';

const Home = () => {
	const navigate = useNavigate();
	const isAuthenticated = useAuthenticated();
	const user = useUser();
	const { logout } = useAuthActions();
	const { showSuccess, showError } = useToastActions();

	const handleLogout = async () => {
		try {
			await logout();
			showSuccess('Logout successful!');
			navigate('/login');
		} catch (error) {
			showError(error);
		}
	};

	return (
		<div>
			<p>Home</p>
			<p>Hello, {isAuthenticated ? user?.name : 'Guest'}</p>

			{isAuthenticated ? (
				<button onClick={handleLogout} className="border p-2 cursor-pointer">
					<p>Logout</p>
				</button>
			) : (
				<button className="border p-2 cursor-pointer">
					<Link to="/login">Login</Link>
				</button>
			)}
		</div>
	);
};

export default Home;
