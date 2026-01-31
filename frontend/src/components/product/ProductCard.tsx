import { useNavigate } from 'react-router-dom';
import type { ProductPublic } from '../../types/product.types';

interface ProductCardProps {
	product: ProductPublic | null;
	disableClick?: boolean;
}

const ProductCard = ({ product }: ProductCardProps) => {
	const navigate = useNavigate();

	if (!product) {
		return <div>No product available</div>;
	}

	const image = product.images.find((img) => img.isDefault) ?? product.images[0];

	const handleProductClick = () => {
		navigate(`/products/${product.id}`);
	};

	return (
		<div onClick={handleProductClick} className='border'>
			{image?.url && <img src={`http://localhost:3000${image.url}`} className='size-44' />}
			<p>{product.name}</p>
			<p>{product.price}</p>
		</div>
	);
};

export default ProductCard;
