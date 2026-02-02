import { prisma } from '../prisma.js';
import { ProductAdmin, ProductAttribute, ProductImage, ProductPublic, ProductVariant } from '../types/product.types.js';
import { mapPrismaProductVariants } from '../utils/mapPrismaProductAttributes.js';
import { mapPrismaProductToAdmin } from '../utils/mapPrismaProductToAdmin.js';
import { mapPrismaProductToPublic } from '../utils/mapPrismaProductToPublic.js';
import {
	CreateProductAttributesDto,
	CreateProductDto,
	CreateProductVariantsDto,
	UpdateProductDto,
} from '../validators/product.validator.js';

export class ProductRepository {
	static findManyPublic = async (options: { skip: number; take: number }): Promise<ProductPublic[]> => {
		const products = await prisma.product.findMany({
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
				attributes: true,
				variants: {
					select: {
						id: true,
						productId: true,
						name: true,
						sku: true,
						price: true,
						stock: true,
						isActive: true,
						options: true,
					},
				},
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

		return products.map((p) => mapPrismaProductToPublic(p));
	};

	static findProductByIdPublic = async (id: number): Promise<ProductPublic | null> => {
		const product = await prisma.product.findUnique({
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
				attributes: true,
				variants: {
					select: {
						id: true,
						productId: true,
						name: true,
						sku: true,
						price: true,
						stock: true,
						isActive: true,
						options: true,
					},
				},
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

		return mapPrismaProductToPublic(product);
	};

	static findManyAdmin = async (options: { skip: number; take: number }): Promise<ProductAdmin[]> => {
		const products = await prisma.product.findMany({
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

				shortDescription: true,

				stock: true,
				lowStockThreshold: true,
				trackInventory: true,

				isActive: true,
				isFeatured: true,

				images: true,
				attributes: true,
				variants: {
					select: {
						id: true,
						productId: true,
						name: true,
						sku: true,
						price: true,
						stock: true,
						isActive: true,
						options: true,
					},
				},
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

		return products.map((p) => mapPrismaProductToAdmin(p));
	};

	static findProductByIdAdmin = async (id: number): Promise<ProductAdmin> => {
		const product = await prisma.product.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				slug: true,
				sku: true,

				price: true,
				comparePrice: true,
				cost: true,

				shortDescription: true,

				stock: true,
				lowStockThreshold: true,
				trackInventory: true,

				isActive: true,
				isFeatured: true,

				images: true,
				attributes: true,
				variants: {
					select: {
						id: true,
						productId: true,
						name: true,
						sku: true,
						price: true,
						stock: true,
						isActive: true,
						options: true,
					},
				},

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

		return mapPrismaProductToAdmin(product);
	};

	static createProduct = async (data: CreateProductDto, slug: string): Promise<ProductAdmin> => {
		const product = await prisma.product.create({
			data: { ...data, slug },
			select: {
				id: true,
				name: true,
				slug: true,
				sku: true,

				price: true,
				comparePrice: true,
				cost: true,

				shortDescription: true,

				stock: true,
				lowStockThreshold: true,
				trackInventory: true,

				isActive: true,
				isFeatured: true,

				images: true,
				attributes: true,
				variants: {
					select: {
						id: true,
						productId: true,
						name: true,
						sku: true,
						price: true,
						stock: true,
						isActive: true,
						options: true,
					},
				},
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

		return mapPrismaProductToAdmin(product);
	};

	static createProductAttributes = async (
		productId: number,
		data: CreateProductAttributesDto,
	): Promise<ProductAttribute[]> => {
		const productAttributes = await prisma.productAttribute.createManyAndReturn({
			data: data.map((a) => ({ productId, ...a })),
		});

		return productAttributes;
	};

	static createProductVariants = async (
		productId: number,
		variants: CreateProductVariantsDto,
	): Promise<ProductVariant[]> => {
		const productVariantsAndOptions = await prisma.$transaction(
			variants.map((variant) =>
				prisma.productVariant.create({
					data: {
						productId,
						name: variant.name,
						sku: variant.sku,
						price: variant.price,
						stock: variant.stock,
						isActive: variant.isActive,
						options: {
							create: variant.options,
						},
					},
					select: {
						id: true,
						productId: true,
						name: true,
						sku: true,
						price: true,
						stock: true,
						isActive: true,
						options: true,
					},
				}),
			),
		);

		return mapPrismaProductVariants(productVariantsAndOptions);
	};

	static updateProduct = async (data: UpdateProductDto, id: number): Promise<Partial<ProductAdmin>> => {
		const product = await prisma.product.update({
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

				shortDescription: true,

				stock: true,
				lowStockThreshold: true,
				trackInventory: true,

				isActive: true,
				isFeatured: true,

				images: true,
				attributes: true,
				variants: {
					select: {
						id: true,
						productId: true,
						name: true,
						sku: true,
						price: true,
						stock: true,
						isActive: true,
						options: true,
					},
				},
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

		return mapPrismaProductToAdmin(product);
	};

	static uploadImage = async (productId: number, fileName: string, isDefault: boolean): Promise<ProductImage> => {
		const image = prisma.$transaction(async (tx) => {
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
				select: {
					id: true,
					url: true,
					altText: true,
					displayOrder: true,
					isDefault: true,
					createdAt: true,
				},
			});
		});

		return image;
	};

	static deleteProduct = (id: number): void => {
		prisma.product.delete({
			where: { id },
		});
	};

	static count = async (): Promise<number> => {
		const count = await prisma.product.count();
		return count;
	};
}
