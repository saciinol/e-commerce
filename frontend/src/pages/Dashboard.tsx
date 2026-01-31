import AdminProducts from '../components/product/AdminProducts';

const Dashboard = () => {
	return (
		<div className="flex items-center justify-center gap-2 min-h-screen mx-2.5">
			<div className="h-[97vh] w-1/5 bg-gray-600 rounded-md"></div>
			<div className="h-[97vh] w-4/5 bg-gray-600 rounded-md overflow-y-scroll">
				<AdminProducts />
			</div>
		</div>
	);
};

export default Dashboard;
