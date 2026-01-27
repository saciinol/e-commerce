import type { AdminCreateProductInput } from '../schemas/product.schema';
import type {
	ApiResponse,
	ProductAdminResponse,
	ProductPublicResponse,
	ProductsAdminResponse,
	ProductsPublicResponse,
} from '../types/product.types';
import api from './api.service';

interface ProductQueryParams {
	page?: number;
	limit?: number;
	categoryId?: number;
	search?: string;
	sortBy?: 'price' | 'name' | 'createdAt';
	sortOrder?: 'asc' | 'desc';
}

export const productAPI = {
	// public endpoints
	getProductsPublic: (params: ProductQueryParams = {}) => api.get<ProductsPublicResponse>('/products', { params }),

	getProductPublic: (id: number) => api.get<ProductPublicResponse>(`/products/${id}`),

	// admin endpoints
	getProductsAdmin: (params: ProductQueryParams = {}) => api.get<ProductsAdminResponse>('/products/admin', { params }),

	getProductAdmin: (id: number) => api.get<ProductAdminResponse>(`/products/admin/${id}`),

	createProduct: (data: AdminCreateProductInput) => api.post<ProductAdminResponse>('/products/admin', data),

	updateProduct: (id: number, data: Partial<AdminCreateProductInput>) =>
		api.put<ProductAdminResponse>(`/products/admin/${id}`, data),

	deleteProduct: (id: number) => api.delete<ApiResponse<{ id: number }>>(`/products/admin/${id}`),
};
