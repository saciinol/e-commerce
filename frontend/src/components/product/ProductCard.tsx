import type { ProductPublic } from '../../types/product.types';

interface ProductCardProps {
	product: ProductPublic;
}

const ProductCard = ({ product }: ProductCardProps) => {
	const image = product.images.find((img) => img.isDefault) ?? product.images[0];

	return (
		<div>
			{image?.url && <img src={`http://localhost:3000${image.url}`} />}
			<p>{product.name}</p>
			<p>{product.price}</p>
		</div>
	);
};

export default ProductCard;
