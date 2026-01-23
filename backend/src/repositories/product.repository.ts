import { prisma } from '../prisma.js';
import { CreateProductDto } from '../validators/product.validator.js';

export class ProductRepository {
	static createProduct = async (data: CreateProductDto, slug: string) => {
		return await prisma.product.create({
			data: { ...data, slug },
		});
	};
}
