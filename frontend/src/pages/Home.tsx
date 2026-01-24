import { Link, useNavigate } from 'react-router-dom';
import { useAuthActions, useAuthenticated, useUser } from '../store/auth.store';
import { useToastStore } from '../store/toast.store';

const Home = () => {
	const navigate = useNavigate();
	const isAuthenticated = useAuthenticated();
	const user = useUser();
	const { logout } = useAuthActions();
	const { showSuccess, showError } = useToastStore();

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
		<div className="m-2">
			<p>Home</p>
			<p>Hello, {isAuthenticated ? `${user?.firstName} ${user?.lastName}` : 'Guest'}</p>
			<p>Role: {user?.role}</p>

			{user?.role === 'SUPER_ADMIN' && (
				<button className="border p-2 cursor-pointer block mb-2">
					<Link to="/admin/register">Create Admin</Link>
				</button>
			)}

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
