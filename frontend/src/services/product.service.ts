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
	getProductsAdmin: (params: ProductQueryParams = {}) => api.get<ProductsAdminResponse>('/admin/products', { params }),

	getProductAdmin: (id: number) => api.get<ProductAdminResponse>(`/admin/products/${id}`),

	createProduct: (data: AdminCreateProductInput) => api.post<ProductAdminResponse>('/admin/products', data),

	updateProduct: (id: number, data: Partial<AdminCreateProductInput>) =>
		api.put<ProductAdminResponse>(`/admin/products/${id}`, data),

	deleteProduct: (id: number) => api.delete<ApiResponse<{ id: number }>>(`/admin/products/${id}`),
};
