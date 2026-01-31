import { ProductRepository } from '../repositories/product.repository.js';
import { ProductImage } from '../types/product.types.js';
import { ProductService } from './product.service.js';

export const productImageService = {
	upload: async (id: number, fileName: string, isDefault: boolean): Promise<ProductImage> => {
		await ProductService.getProductByIdAdmin(id);

		const productImage = await ProductRepository.uploadImage(id, fileName, isDefault);

		return productImage;
	},
};
