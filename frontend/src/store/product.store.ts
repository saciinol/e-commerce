import { create } from 'zustand';
import type { ProductAdmin, ProductPublic } from '../types/product.types';
import type { AdminCreateProductInput } from '../schemas/product.schema';

interface ProductStore {
	products: ProductPublic[] | ProductAdmin[] | null;

	actions: {
		adminCreateProduct: (data: AdminCreateProductInput) => Promise<void>;
		adminDeleteProduct: (id: number) => Promise<void>;
		getProducts: () => Promise<void>;
		getProduct: (id: number) => Promise<void>;
	};
}

const useProductStore = create<ProductStore>((set) => ({
	products: null,

	actions: {
		adminCreateProduct: async (data: AdminCreateProductInput) => {},

		adminDeleteProduct: async (id: number) => {},

		getProducts: async () => {},

		getProduct: async (id: number) => {},
	},
}));

export const useProducts = () => useProductStore((state) => state.products);
