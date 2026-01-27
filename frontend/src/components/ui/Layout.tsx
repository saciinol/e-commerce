import { Link, useNavigate } from 'react-router-dom';
import { useAuthActions, useAuthAuthenticated, useAuthUser } from '../../store/auth.store';
import { useToastStore } from '../../store/toast.store';
import { ChevronDown, LogIn, LogOut, ShoppingCart, UserStar } from 'lucide-react';
import Dropdown, { DropdownItem } from './Dropdown';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate();
	const { logout } = useAuthActions();
	const user = useAuthUser();
	const isAuthenticated = useAuthAuthenticated();
	const { showSuccess, showError } = useToastStore();

	const handleLogout = async () => {
		try {
			await new Promise((res) => setTimeout(res, 500));
			await logout();
			showSuccess('Logout successful!');
			navigate('/login');
		} catch (error) {
			showError(error);
		}
	};

	return (
		<div className="min-h-screen bg-bg-primary">
			<div className="bg-bg-secondary shadow-sm dark:border-b border-zinc-900">
				<header className="max-w-7xl mx-auto px-4">
					<nav className="flex justify-between items-center h-16">
						<Link to="/" className="flex gap-2">
							<ShoppingCart className="size-6 text-blue-600" />
							<p className="text-text-primary">E-Commerce</p>
						</Link>

						<div className="flex gap-2">
							<ThemeToggle />

							<Dropdown
								className="border border-text-primary/10"
								trigger={
									<div>
										<ChevronDown className="size-6" />
									</div>
								}
							>
								<DropdownItem className="flex-col items-start">
									<p className="text-sm">Hello, {isAuthenticated ? `${user?.firstName} ${user?.lastName}` : 'Guest'}</p>
								</DropdownItem>
								<hr className="mx-2 text-text-primary/20" />
								{isAuthenticated && user?.role === 'SUPER_ADMIN' && (
									<DropdownItem>
										<UserStar className="size-4" />
										<Link to="/admin/register">Create Admin</Link>
									</DropdownItem>
								)}
								{isAuthenticated ? (
									<DropdownItem onClick={handleLogout}>
										<LogOut className="size-4" />
										Logout
									</DropdownItem>
								) : (
									<DropdownItem>
										<LogIn className="size-4" />
										<Link to="/login">Login</Link>
									</DropdownItem>
								)}
							</Dropdown>
						</div>
					</nav>
				</header>
			</div>

			<main className="max-w-380 mx-auto p-2">{children}</main>
		</div>
	);
};

export default Layout;
