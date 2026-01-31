import { useEffect } from 'react';
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

	if (!currentProduct) {
		return <div>No product available</div>;
	}

	const image = currentProduct.images.find((img) => img.isDefault) ?? currentProduct.images[0];

	if (isLoading) {
		return (
			<div className="py-20 flex justify-center items-center">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="mt-2">
			<div className="flex justify-center mb-4">
				{image?.url && <img src={`http://localhost:3000${image.url}`} className="size-60" />}
			</div>
			<p>{currentProduct.name}</p>
			<p>{currentProduct.price}</p>
			<p>{currentProduct.shortDescription}</p>
			<p>Category: {currentProduct.category.name}</p>{' '}
		</div>
	);
};

export default Product;
