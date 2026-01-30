import { useEffect } from 'react';
import ProductCard from '../components/product/ProductCard';
import { publicProductActions, usePublicProduct, usePublicProductsLoading } from '../store/product.store';
import { useParams } from 'react-router-dom';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const Product = () => {
	const { id } = useParams();
	const currentProduct = usePublicProduct();
	const isLoading = usePublicProductsLoading();

	const productId = Number(id);

	useEffect(() => {
		publicProductActions.fetchProduct(productId);
	}, [productId]);

	if (isLoading) {
		return (
			<div className="py-20 flex justify-center items-center">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className='mt-2'>
			<ProductCard product={currentProduct} />
		</div>
	);
};

export default Product;
