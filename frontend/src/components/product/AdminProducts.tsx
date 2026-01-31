import React, { useEffect, useState } from 'react';
import { adminProductActions, useAdminProducts, useAdminProductsLoading } from '../../store/product.store';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import AdminProductsTable, { TableItem } from './AdminProductsTable';

const AdminProducts = () => {
	const products = useAdminProducts();
	const isLoading = useAdminProductsLoading();

	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);

	useEffect(() => {
		adminProductActions.fetchProducts({ page, limit });
	}, [page, limit]);

	return (
		<div className='p-2 text-white!'>
			<button onClick={() => setPage(page + 1)} className="border cursor-pointer p-2 mb-5 mr-4">
				Page {page}
			</button>

			<button onClick={() => setLimit(limit + 5)} className="border cursor-pointer p-2 mb-5">
				Limit {limit}
			</button>

			{isLoading! ? (
				<div className="py-20 flex justify-center items-center">
					<LoadingSpinner />
				</div>
			) : (
				<AdminProductsTable>
					{products.map((product) => (
						<TableItem key={product.id} product={product} />
					))}
				</AdminProductsTable>
			)}
		</div>
	);
};

export default AdminProducts;
