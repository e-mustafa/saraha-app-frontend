// utils/apiClient.ts
import { APP_ROUTES } from '@/shared/config/app-configs';
import { ApiError } from './app-error';

interface RequestOptions extends RequestInit {
	headers?: Record<string, string>;
}

/**
 * ApiClient class for making API requests with automatic refresh token handling and error management
 */
class ApiClient {
	private baseUrl: string = '/api/proxy';

	private getClientLocale(): string {
		if (typeof window !== 'undefined') {
			const segments = window.location.pathname.split('/');
			return ['ar', 'en'].includes(segments[1]) ? segments[1] : 'ar';
		}
		return 'ar';
	}

	private async request<TResponse>(endpoint: string, options: RequestOptions = {}): Promise<TResponse> {
		const url = `${this.baseUrl}${endpoint}`;
		const isFormData = options.body instanceof FormData;
		const headers: Record<string, string> = { ...options.headers };

		if (!isFormData && !headers['Content-Type']) {
			headers['Content-Type'] = 'application/json';
		}

		let response = await fetch(url, { ...options, headers });

		if (response.status === 401) {
			console.warn('Access token expired. Triggering refresh handler...');
			const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });

			if (refreshRes.ok) {
				response = await fetch(url, { ...options, headers });
			} else {
				if (typeof window !== 'undefined') {
					const locale = this.getClientLocale();
					// window.location.href = `/${locale}${APP_ROUTES.login}`;
					if (window.location.pathname.includes('/user/')) {
						window.location.href = `/${locale}${APP_ROUTES.login}`;
					}
				}
				throw new Error('SESSION_EXPIRED');
			}
		}

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			// هنا يتم رمي كائن ApiError المحتوي على الأخطاء بالتفصيل
			throw new ApiError(errorData.message || `Error: ${response.status}`, response.status, errorData.errors);
		}

		return response.json() as Promise<TResponse>;
	}

	async get<TResponse>(endpoint: string, options?: RequestOptions): Promise<TResponse> {
		return this.request<TResponse>(endpoint, { method: 'GET', ...options });
	}

	async post<TResponse, TBody = unknown>(endpoint: string, body: TBody, options?: RequestOptions): Promise<TResponse> {
		const isFormData = body instanceof FormData;
		return this.request<TResponse>(endpoint, {
			method: 'POST',
			body: isFormData ? (body as FormData) : JSON.stringify(body),
			...options,
		});
	}

	async patch<TResponse, TBody = unknown>(endpoint: string, body: TBody, options?: RequestOptions): Promise<TResponse> {
		const isFormData = body instanceof FormData;
		return this.request<TResponse>(endpoint, {
			method: 'PATCH',
			body: isFormData ? (body as FormData) : JSON.stringify(body),
			...options,
		});
	}

	async put<TResponse, TBody = unknown>(endpoint: string, body: TBody, options?: RequestOptions): Promise<TResponse> {
		const isFormData = body instanceof FormData;
		return this.request<TResponse>(endpoint, {
			method: 'PUT',
			body: isFormData ? (body as FormData) : JSON.stringify(body),
			...options,
		});
	}

	async delete<TResponse, TBody = unknown>(endpoint: string, body?: TBody, options?: RequestOptions): Promise<TResponse> {
		const isFormData = body instanceof FormData;
		return this.request<TResponse>(endpoint, {
			method: 'DELETE',
			body: body ? (isFormData ? (body as FormData) : JSON.stringify(body)) : undefined,
			...options,
		});
	}
}

export const apiClient = new ApiClient();
