import { prisma } from '../prisma.js';
import { CreateProductDto } from '../validators/product.validator.js';

export class ProductRepository {
	static findMany = (options: { skip: number; take: number }) => {
		return prisma.product.findMany({
			skip: options.skip,
			take: options.take,
		});
	};

	static findProductById = (id: number) => {
		return prisma.product.findUnique({
			where: { id },
		});
	};

	static createProduct = (data: CreateProductDto, slug: string) => {
		return prisma.product.create({
			data: { ...data, slug },
		});
	};

	static deleteProduct = (id: number) => {
		return prisma.product.delete({
			where: { id },
		});
	};

	static count = () => {
		return prisma.product.count();
	};
}
