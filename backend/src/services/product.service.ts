import { ProductRepository } from '../repositories/product.repository.js';
import { CreateProductDto, GetProductsQuery } from '../validators/product.validator.js';
import { createUniqueSlug } from '../utils/slugify.js';
import { NotFoundError } from '../utils/errors.js';
import { ReqUser } from '../types/token.types.js';

export class ProductService {
	static getProducts = async (user: ReqUser | undefined, params: GetProductsQuery) => {
		const { page, limit } = params;
		const skip = (page - 1) * limit;

		let products;
		let total;
		if (user?.role !== 'CUSTOMER') {
			[products, total] = await Promise.all([
				ProductRepository.findManyAdmin({ skip, take: limit }),
				ProductRepository.count(),
			]);
		} else {
			[products, total] = await Promise.all([
				ProductRepository.findManyPublic({ skip, take: limit }),
				ProductRepository.count(),
			]);
		}

		return {
			data: products,
			pagination: {
				page: page,
				limit: limit,
				total: total,
				totalPages: Math.ceil(total / limit),
			},
		};
	};

	static getProductById = async (user: ReqUser | undefined, id: number) => {
		let product;
		if (user?.role !== 'CUSTOMER') {
			product = await ProductRepository.findProductByIdAdmin(id);
		} else {
			product = await ProductRepository.findProductByIdPublic(id);
		}

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

	static deleteProduct = async (user: ReqUser | undefined, id: number) => {
		await this.getProductById(user, id);
		await ProductRepository.deleteProduct(id);
	};
}
