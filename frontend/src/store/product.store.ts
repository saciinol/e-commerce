import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ProductPublic, ProductAdmin, Pagination } from '../types/product.types';
import { productAPI } from '../services/product.service';
import type { AdminCreateProductInput } from '../schemas/product.schema';

interface PublicProductStore {
	products: ProductPublic[];
	currentProduct: ProductPublic | null;
	isLoading: boolean;
	error: string | null;
}

interface PublicProductActions {
	fetchProducts: (params?: { page?: number; limit?: number; categoryId?: number }) => Promise<void>;
	fetchProduct: (id: number) => Promise<void>;
	clearError: () => void;
	reset: () => void;
}

export const usePublicProductStore = create<PublicProductStore>()(
	devtools(
		() => ({
			products: [],
			currentProduct: null,
			isLoading: false,
			error: null,
		}),
		{ name: 'PublicProductStore' },
	),
);

export const publicProductActions: PublicProductActions = {
	fetchProducts: async (params = {}) => {
		usePublicProductStore.setState({ isLoading: true, error: null });
		try {
			const response = await productAPI.getProductsPublic(params);
			usePublicProductStore.setState({
				products: response.data.data.products,
				isLoading: false,
			});
		} catch (error) {
			usePublicProductStore.setState({
				error: error instanceof Error ? error.message : 'Failed to load products',
				isLoading: false,
			});
		}
	},
	fetchProduct: async (id) => {
		usePublicProductStore.setState({ isLoading: true, error: null });
		try {
			const response = await productAPI.getProductPublic(id);
			usePublicProductStore.setState({
				currentProduct: response.data.data,
				isLoading: false,
			});
		} catch (error) {
			usePublicProductStore.setState({
				error: error instanceof Error ? error.message : 'Failed to load product',
				isLoading: false,
			});
		}
	},

	clearError: () => usePublicProductStore.setState({ error: null }),
	reset: () => usePublicProductStore.setState({ products: [], currentProduct: null, error: null }),
};

export const usePublicProducts = () => usePublicProductStore((state) => state.products);
export const usePublicProduct = () => usePublicProductStore((state) => state.currentProduct);
export const usePublicProductsLoading = () => usePublicProductStore((state) => state.isLoading);
export const usePublicProductsError = () => usePublicProductStore((state) => state.error);

interface AdminProductStore {
	products: ProductAdmin[];
	currentProduct: ProductAdmin | null;
	pagination: Pagination | null;
	isLoading: boolean;
	error: string | null;

	actions: {
		fetchProducts: (params?: { page?: number; limit?: number }) => Promise<void>;
		fetchProduct: (id: number) => Promise<void>;
		createProduct: (data: AdminCreateProductInput) => Promise<ProductAdmin>;
		updateProduct: (id: number, data: Partial<AdminCreateProductInput>) => Promise<void>;
		deleteProduct: (id: number) => Promise<void>;
		clearError: () => void;
		reset: () => void;
	};
}

export const useAdminProductStore = create<AdminProductStore>()(
	devtools(
		(set) => ({
			products: [],
			currentProduct: null,
			pagination: null,
			isLoading: false,
			error: null,

			actions: {
				fetchProducts: async (params = {}) => {
					set({ isLoading: true, error: null });
					try {
						const response = await productAPI.getProductsAdmin(params);
						const { products, pagination } = response.data.data;

						set({
							products,
							pagination,
							isLoading: false,
						});
					} catch (error) {
						set({
							error: error instanceof Error ? error.message : 'Failed to load products',
							isLoading: false,
						});
					}
				},

				fetchProduct: async (id) => {
					set({ isLoading: true, error: null });
					try {
						const response = await productAPI.getProductAdmin(id);
						set({
							currentProduct: response.data.data,
							isLoading: false,
						});
					} catch (error) {
						set({
							error: error instanceof Error ? error.message : 'Failed to load product',
							isLoading: false,
						});
					}
				},

				createProduct: async (data) => {
					set({ isLoading: true, error: null });
					try {
						const response = await productAPI.createProduct(data);
						const newProduct = response.data.data;

						set((state) => ({
							products: [newProduct, ...state.products],
							isLoading: false,
						}));

						return newProduct;
					} catch (error) {
						set({
							error: error instanceof Error ? error.message : 'Failed to create product',
							isLoading: false,
						});
						throw error;
					}
				},

				updateProduct: async (id, data) => {
					set({ isLoading: true, error: null });
					try {
						const response = await productAPI.updateProduct(id, data);
						const updatedProduct = response.data.data;

						set((state) => ({
							products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
							currentProduct: state.currentProduct?.id === id ? updatedProduct : state.currentProduct,
							isLoading: false,
						}));
					} catch (error) {
						set({
							error: error instanceof Error ? error.message : 'Failed to update product',
							isLoading: false,
						});
						throw error;
					}
				},

				deleteProduct: async (id) => {
					set({ isLoading: true, error: null });
					try {
						await productAPI.deleteProduct(id);

						set((state) => ({
							products: state.products.filter((p) => p.id !== id),
							isLoading: false,
						}));
					} catch (error) {
						set({
							error: error instanceof Error ? error.message : 'Failed to delete product',
							isLoading: false,
						});
						throw error;
					}
				},

				clearError: () => set({ error: null }),
				reset: () => set({ products: [], currentProduct: null, pagination: null, error: null }),
			},
		}),
		{ name: 'AdminProductStore' },
	),
);

export const useAdminProducts = () => useAdminProductStore((state) => state.products);
export const useAdminProduct = () => useAdminProductStore((state) => state.currentProduct);
export const useAdminPagination = () => useAdminProductStore((state) => state.pagination);
export const useAdminProductsLoading = () => useAdminProductStore((state) => state.isLoading);
export const useAdminProductsError = () => useAdminProductStore((state) => state.error);
export const useAdminProductsActions = () => useAdminProductStore((state) => state.actions);
