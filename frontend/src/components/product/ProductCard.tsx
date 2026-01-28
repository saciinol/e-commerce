import type { ProductPublic } from '../../types/product.types';

interface ProductCardProps {
	product: ProductPublic;
}

const ProductCard = ({ product }: ProductCardProps) => {
	return (
		<div>
			<p>{product.name}</p>
			<p>{product.price}</p>
		</div>
	);
};

export default ProductCard;
