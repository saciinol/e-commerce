import { useEffect, useState } from 'react';
import {
	publicProductActions,
	usePublicProducts,
	usePublicProductsLoading,
} from '../../store/product.store';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import ProductCard from './ProductCard';

const ProductList = () => {
	const products = usePublicProducts();
	const isLoading = usePublicProductsLoading();
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(5);

	useEffect(() => {
		publicProductActions.fetchProducts({ page, limit });
	}, [page, limit]);

	return (
		<div>
			<button onClick={() => setPage(page + 1)} className="border cursor-pointer p-2 mb-5 mr-4">
				Page {page}
			</button>

			<button onClick={() => setLimit(limit + 5)} className="border cursor-pointer p-2 mb-5">
				Limit {limit}
			</button>

			<div className="grid grid-cols-2 gap-4">
				{isLoading ? <LoadingSpinner /> : products.map((product) => <ProductCard key={product.id} product={product} />)}
			</div>
		</div>
	);
};

export default ProductList;
