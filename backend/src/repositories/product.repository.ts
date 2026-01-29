import { prisma } from '../prisma.js';
import { CreateProductDto, UpdateProductDto } from '../validators/product.validator.js';

export class ProductRepository {
	static findManyPublic = (options: { skip: number; take: number }) => {
		return prisma.product.findMany({
			skip: options.skip,
			take: options.take,
			select: {
				id: true,
				name: true,
				slug: true,
				price: true,
				comparePrice: true,
				shortDescription: true,
				isFeatured: true,
				images: true,
				averageRating: true,
				category: {
					select: {
						id: true,
						name: true,
						slug: true,
					},
				},
			},
		});
	};

	static findProductByIdPublic = (id: number) => {
		return prisma.product.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				slug: true,
				price: true,
				comparePrice: true,
				shortDescription: true,
				isFeatured: true,
				images: true,
				averageRating: true,
				category: {
					select: {
						id: true,
						name: true,
						slug: true,
					},
				},
			},
		});
	};

	static findManyAdmin = (options: { skip: number; take: number }) => {
		return prisma.product.findMany({
			skip: options.skip,
			take: options.take,
			select: {
				id: true,
				name: true,
				slug: true,
				sku: true,

				price: true,
				comparePrice: true,
				cost: true,

				stock: true,
				lowStockThreshold: true,
				trackInventory: true,

				isActive: true,
				isFeatured: true,
				images: true,

				metaTitle: true,
				metaDescription: true,

				viewCount: true,
				salesCount: true,
				averageRating: true,

				category: {
					select: {
						id: true,
						name: true,
						slug: true,
					},
				},

				createdAt: true,
				updatedAt: true,
			},
		});
	};

	static findProductByIdAdmin = (id: number) => {
		return prisma.product.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				slug: true,
				sku: true,

				price: true,
				comparePrice: true,
				cost: true,

				stock: true,
				lowStockThreshold: true,
				trackInventory: true,

				isActive: true,
				isFeatured: true,
				images: true,

				metaTitle: true,
				metaDescription: true,

				viewCount: true,
				salesCount: true,
				averageRating: true,

				category: {
					select: {
						id: true,
						name: true,
						slug: true,
					},
				},

				createdAt: true,
				updatedAt: true,
			},
		});
	};

	static createProduct = (data: CreateProductDto, slug: string) => {
		return prisma.product.create({
			data: { ...data, slug },
			select: {
				id: true,
				name: true,
				slug: true,
				sku: true,

				price: true,
				comparePrice: true,
				cost: true,

				stock: true,
				lowStockThreshold: true,
				trackInventory: true,

				isActive: true,
				isFeatured: true,
				images: true,

				metaTitle: true,
				metaDescription: true,

				viewCount: true,
				salesCount: true,
				averageRating: true,

				category: {
					select: {
						id: true,
						name: true,
						slug: true,
					},
				},

				createdAt: true,
				updatedAt: true,
			},
		});
	};

	static updateProduct = (data: UpdateProductDto, id: number) => {
		return prisma.product.update({
			where: { id },
			data,
			select: {
				id: true,
				name: true,
				slug: true,
				sku: true,

				price: true,
				comparePrice: true,
				cost: true,

				stock: true,
				lowStockThreshold: true,
				trackInventory: true,

				isActive: true,
				isFeatured: true,
				images: true,

				metaTitle: true,
				metaDescription: true,

				viewCount: true,
				salesCount: true,
				averageRating: true,

				category: {
					select: {
						id: true,
						name: true,
						slug: true,
					},
				},

				createdAt: true,
				updatedAt: true,
			},
		});
	};

	static uploadImage = (productId: number, fileName: string, isDefault: boolean) => {
		return prisma.$transaction(async (tx) => {
			if (isDefault) {
				await tx.productImage.updateMany({
					where: { productId },
					data: { isDefault: false },
				});
			}

			return tx.productImage.create({
				data: {
					productId,
					url: `/uploads/products/${fileName}`,
					isDefault,
				},
			});
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
