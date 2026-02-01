import { ProductRepository } from '../repositories/product.repository.js';
import { CreateProductDto, GetProductsQuery, UpdateProductDto } from '../validators/product.validator.js';
import { createUniqueSlug } from '../utils/slugify.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import {
	ProductAdmin,
	ProductPublic,
	ProductsAdminPaginated,
	ProductsPublicPaginated,
} from '../types/product.types.js';

export class ProductService {
	static getProductsPublic = async (params: GetProductsQuery): Promise<ProductsPublicPaginated> => {
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

	static getProductByIdPublic = async (id: number): Promise<ProductPublic> => {
		const product = await ProductRepository.findProductByIdPublic(id);

		if (!product) {
			throw new NotFoundError(`Product with id ${id} not found`);
		}

		return product;
	};

	static getProductsAdmin = async (params: GetProductsQuery): Promise<ProductsAdminPaginated> => {
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

	static getProductByIdAdmin = async (id: number): Promise<ProductAdmin> => {
		const product = await ProductRepository.findProductByIdAdmin(id);

		if (!product) {
			throw new NotFoundError(`Product with id ${id} not found`);
		}

		return product;
	};

	static createProduct = async (productData: CreateProductDto): Promise<ProductAdmin> => {
		return createUniqueSlug(productData.name, (slug) => ProductRepository.createProduct(productData, slug), {
			fallback: 'product',
			maxAttempts: 10,
		});
	};

	static updateProduct = async (productData: UpdateProductDto, id: number): Promise<Partial<ProductAdmin>> => {
		if (!productData) {
			throw new ValidationError('No product data');
		}

		await this.getProductByIdAdmin(id);

		return ProductRepository.updateProduct(productData, id);
	};

	static deleteProduct = async (id: number): Promise<void> => {
		await this.getProductByIdAdmin(id);

		ProductRepository.deleteProduct(id);
	};
}
