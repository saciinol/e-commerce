import { ProductRepository } from '../repositories/product.repository.js';
import { CreateProductDto, GetProductsQuery, UpdateProductDto } from '../validators/product.validator.js';
import { createUniqueSlug } from '../utils/slugify.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export class ProductService {
	static getProductsPublic = async (params: GetProductsQuery) => {
		const { page, limit } = params;
		const skip = (page - 1) * limit;

		const [products, total] = await Promise.all([
			ProductRepository.findManyPublic({ skip, take: limit }),
			ProductRepository.count(),
		]);

		return {
			products,
			pagination: {
				page: page,
				limit: limit,
				total: total,
				totalPages: Math.ceil(total / limit),
			},
		};
	};

	static getProductByIdPublic = async (id: number) => {
		const product = await ProductRepository.findProductByIdPublic(id);

		if (!product) {
			throw new NotFoundError(`User with id ${id} not found`);
		}

		return product;
	};

	static getProductsAdmin = async (params: GetProductsQuery) => {
		const { page, limit } = params;
		const skip = (page - 1) * limit;

		const [products, total] = await Promise.all([
			ProductRepository.findManyAdmin({ skip, take: limit }),
			ProductRepository.count(),
		]);

		return {
			products,
			pagination: {
				page: page,
				limit: limit,
				total: total,
				totalPages: Math.ceil(total / limit),
			},
		};
	};

	static getProductByIdAdmin = async (id: number) => {
		const product = await ProductRepository.findProductByIdAdmin(id);

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

	static updateProduct = async (productData: UpdateProductDto, id: number) => {
		if (!productData) {
			throw new ValidationError('No product data');
		}

		const product = await this.getProductByIdAdmin(id);

		if (!product) {
			throw new NotFoundError(`User with id ${id} not found`);
		}

		return ProductRepository.updateProduct(productData, id);
	};

	static deleteProduct = async (id: number) => {
		const product = await this.getProductByIdAdmin(id);

		if (!product) {
			throw new NotFoundError(`User with id ${id} not found`);
		}

		await ProductRepository.deleteProduct(id);
	};
}
