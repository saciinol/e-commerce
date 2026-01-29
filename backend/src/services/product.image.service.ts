import { ProductRepository } from '../repositories/product.repository.js';
import { NotFoundError } from '../utils/errors.js';
import { ProductService } from './product.service.js';

export const productImageService = {
	upload: async (id: number, fileName: string, isDefault: boolean) => {
		const product = await ProductService.getProductByIdAdmin(id);

		if (!product) {
			throw new NotFoundError(`User with id ${id} not found`);
		}

    const productImage = await ProductRepository.uploadImage(id, fileName, isDefault);

    return productImage;
	},
};
