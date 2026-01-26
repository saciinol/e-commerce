import type { AdminCreateProductInput } from '../schemas/product.schema';
import type { ProductResponseAdmin } from '../types/product.types';
import api from './api';

export const productAPI = {
	adminCreateProduct: (data: AdminCreateProductInput) =>
		api.post<ProductResponseAdmin>('/product/admin/create-product', data),
	adminDeleteProduct: (id: number) => api.delete(`/product/admin/${String(id)}`),
	getProducts: <T>() => api.get<T>('/product/'),
	getProduct: <T>(id: number) => api.get<T>(`/product/${String(id)}`),
};
