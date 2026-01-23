import { ProductRepository } from '../repositories/product.repository.js';
import { CreateProductDto } from '../validators/product.validator.js';
import { createUniqueSlug } from '../utils/slugify.js';

export class ProductService {
	static createProduct = async (productData: CreateProductDto) => {
		return createUniqueSlug(productData.name, (slug) => ProductRepository.createProduct(productData, slug), {
			fallback: 'product',
			maxAttempts: 10,
		});
	};
}
