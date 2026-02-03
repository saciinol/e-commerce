import { CategoryRepository } from '../repositories/category.repository.js';
import { CategorySummary } from '../types/product.types.js';
import { ValidationError } from '../utils/errors.js';
import { createUniqueSlug } from '../utils/slugify.js';
import { GetCategoriesDto } from '../validators/category.validator.js';

export class CategoryService {
	static getCategories = async (): Promise<CategorySummary[]> => {
		const categories = await CategoryRepository.findMany();

		return categories;
	};

	static create = async (data: GetCategoriesDto): Promise<CategorySummary> => {
		if (!data) {
			throw new ValidationError('No product data');
		}

		return createUniqueSlug(data.name, (slug) => CategoryRepository.create(data, slug), {
			fallback: 'category',
			maxAttempts: 10,
		});
	};
}
