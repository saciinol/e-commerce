import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminRegisterForm from '../components/auth/AdminRegisterForm';

const AdminRegister = () => {
	const navigate = useNavigate();

	return (
		<section className="min-h-screen bg-bg-primary flex items-center justify-center">
			<div className="relative bg-bg-secondary px-6 py-12 rounded-lg shadow-md w-full max-w-sm mx-3 space-y-6">
				<div className="absolute top-3 left-3">
					<ArrowLeft className="cursor-pointer" onClick={() => navigate(-1)} />
				</div>
				<h1 className="text-2xl font-bold text-center text-text-primary">Admin Register</h1>

				<AdminRegisterForm />

				<div className="flex justify-center gap-1 text-sm">
					<p className="text-text-third">Already have an account?</p>
					<Link to="/login" className="text-text-primary font-semibold hover:underline">
						Login
					</Link>
				</div>
			</div>
		</section>
	);
};

export default AdminRegister;
