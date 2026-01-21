import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
	return (
		<section className="min-h-screen bg-bg-primary flex items-center justify-center">
			<div className="bg-bg-secondary px-6 py-12 rounded-lg shadow-md w-full max-w-sm mx-3 space-y-6">
				<h1 className="text-2xl font-bold text-center text-text-primary">Login</h1>

				<LoginForm />

        <div className='flex justify-center gap-1 text-sm'>
          <p className='text-text-third'>Don't have an account?</p>
          <Link to="/register" className='text-text-primary font-semibold hover:underline'>
          Sign up
          </Link>
        </div>
			</div>
		</section>
	);
};

export default Login;
