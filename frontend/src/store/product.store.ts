import { create } from 'zustand';
import type {
	ProductAdmin,
	ProductPublic,
	ProductResponseAdmin,
	ProductResponsePublic,
	ProductsResponseAdmin,
	ProductsResponsePublic,
} from '../types/product.types';
import type { AdminCreateProductInput } from '../schemas/product.schema';
import { productAPI } from '../services/product.api';
import type { Role } from '../types';

interface ProductStore {
	products: ProductPublic[] | ProductAdmin[] | null;
	product: ProductPublic | ProductAdmin | null;

	actions: {
		adminCreateProduct: (data: AdminCreateProductInput) => Promise<void>;
		adminDeleteProduct: (id: number) => Promise<void>;
		getProducts: (role: Role) => Promise<void>;
		getProduct: (role: Role, id: number) => Promise<void>;
	};
}

const useProductStore = create<ProductStore>((set) => ({
	products: null,
	product: null,

	actions: {
		adminCreateProduct: async (data: AdminCreateProductInput) => {},

		adminDeleteProduct: async (id: number) => {},

		getProducts: async (role: Role) => {
			if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
				const response = await productAPI.getProducts<ProductsResponseAdmin>();
				const { products, pagination } = response.data.data;

				set({ products });
			} else {
				const response = await productAPI.getProducts<ProductsResponsePublic>();

				const { products, pagination } = response.data.data;

				set({ products });
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
