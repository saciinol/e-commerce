import { create } from 'zustand';
import type {
	ProductAdmin,
	ProductPublic,
	ProductResponse,
	ProductResponseAdmin,
	ProductResponsePublic,
	ProductsResponseAdmin,
	ProductsResponsePublic,
} from '../types/product.types';
import type { AdminCreateProductInput } from '../schemas/product.schema';
import { productAPI } from '../services/product.api';
import type { Role } from '../types';

interface ProductStore {
	products: ProductResponse | null;
	product: ProductPublic | ProductAdmin | null;

	actions: {
		adminCreateProduct: (data: AdminCreateProductInput) => Promise<void>;
		adminDeleteProduct: (id: number) => Promise<void>;
		getProducts: (role: Role) => Promise<void>;
		getProduct: (role: Role, id: number) => Promise<void>;
	};
}

const useProductStore = create<ProductStore>((set, get) => ({
	products: null,
	product: null,

	actions: {
		adminCreateProduct: async (data: AdminCreateProductInput) => {
			const { products } = get();
			const response = await productAPI.adminCreateProduct(data);
			const { data: product } = response.data;

			if (products?.kind === 'admin') {
				set({
					products: {
						kind: 'admin',
						products: [product, ...products.products],
					},
				});
			}
		},

		adminDeleteProduct: async (id: number) => {
			const { products } = get();

			try {
				await productAPI.adminDeleteProduct(id);

				if (products?.kind === 'admin') {
					set({
						products: {
							kind: 'admin',
							products: products.products.filter((p) => p.id !== id),
						},
					});
				}
			} catch (error) {
				console.log('Failed to delete product', error);
			}
		},

		getProducts: async (role: Role) => {
			try {
				if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
					const response = await productAPI.getProducts<ProductsResponseAdmin>();
					const { products, pagination } = response.data.data;

					set({
						products: {
							kind: 'admin',
							products,
						},
					});
				} else {
					const response = await productAPI.getProducts<ProductsResponsePublic>();

					const { products, pagination } = response.data.data;

					set({
						products: {
							kind: 'public',
							products,
						},
					});
				}
			} catch (error) {
				console.error('Failed to load products', error);
			}
		},

		getProduct: async (role: Role, id: number) => {
			if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
				const response = await productAPI.getProduct<ProductResponseAdmin>(id);
				const { data } = response.data;

				set({ product: data });
			} else {
				const response = await productAPI.getProduct<ProductResponsePublic>(id);

				const { data } = response.data;

				set({ product: data });
			}
		},
	},
}));

export const useProducts = () => useProductStore((state) => state.products);
