import { prisma } from '../prisma.js';
import { CreateProductDto } from '../validators/product.validator.js';

export class ProductRepository {
	static createProduct = (data: CreateProductDto, slug: string) => {
		return prisma.product.create({
			data: { ...data, slug },
		});
	};

	static findProductById = (id: number) => {
		return prisma.product.findUnique({
			where: { id },
		});
	};

	static deleteProduct = (id: number) => {
		return prisma.product.delete({
			where: { id },
		});
	};
}
