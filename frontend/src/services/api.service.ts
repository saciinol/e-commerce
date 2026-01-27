import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
	baseURL: '/api',
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

let accessToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{
	resolve: (token: string) => void;
	reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token!);
		}
	});
	failedQueue = [];
};

export const setAccessToken = (token: string | null) => {
	accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
	accessToken = null;
};

api.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		if (accessToken && config.headers) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as InternalAxiosRequestConfig;

    if (originalRequest?._skipAuthRefresh) {
      return Promise.reject(error);
    }

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

		if (error.response?.status === 401) {
			if (isRefreshing) {
				// already refreshing - queue this request
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						if (originalRequest.headers) {
							originalRequest.headers.Authorization = `Bearer ${token}`;
						}
						return api(originalRequest);
					})
					.catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const refreshRes = await api.post('/auth/refresh');
				const newAccessToken = refreshRes.data.data.accessToken;

				setAccessToken(newAccessToken);
				processQueue(null, newAccessToken);

				// retry original request
				if (originalRequest.headers) {
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				}
				return api(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);
				clearAccessToken();

				if (window.location.pathname !== '/login') {
					window.location.href = '/login';
				}

				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);

export default api;
