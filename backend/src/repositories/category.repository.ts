import { prisma } from '../prisma.js';
import { CategorySummary } from '../types/product.types.js';
import { GetCategoriesDto } from '../validators/category.validator.js';

export class CategoryRepository {
	static findMany = async (): Promise<CategorySummary[]> => {
		return await prisma.category.findMany({
			select: {
				id: true,
				name: true,
				slug: true,
			},
		});
	};

	static create = async (data: GetCategoriesDto, slug: string): Promise<CategorySummary> => {
		return await prisma.category.create({
			data: { ...data, slug },
			select: {
				id: true,
				name: true,
				slug: true,
			},
		});
	};
}
