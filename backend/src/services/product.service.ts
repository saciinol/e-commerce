import { ProductRepository } from '../repositories/product.repository.js';
import { CreateProductDto } from '../validators/product.validator.js';
import { createUniqueSlug } from '../utils/slugify.js';
import { NotFoundError } from '../utils/errors.js';

export class ProductService {
	static getProductById = async (id: number) => {
		const product = await ProductRepository.findProductById(id);

		if (!product) {
			throw new NotFoundError(`User with id ${id} not found`);
		}

		return product;
	};

	static createProduct = async (productData: CreateProductDto) => {
		return createUniqueSlug(productData.name, (slug) => ProductRepository.createProduct(productData, slug), {
			fallback: 'product',
			maxAttempts: 10,
		});
	};

	static deleteProduct = async (id: number) => {
		await this.getProductById(id);
		await ProductRepository.deleteProduct(id);
	};
}
