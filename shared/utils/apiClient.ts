// utils/apiClient.ts
import { APP_ROUTES } from '@/shared/config/app-configs';
import { IResponse } from '../types/index';
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

		let response: Response;

		try {
			response = await fetch(url, { ...options, headers });
		} catch (error) {
			// Catch network errors (e.g., completely offline or DNS failure)
			throw new ApiError('Network error, please check your internet connection', 0);
		}

		// --- Actual 401 Handling Logic (Silent Refresh) ---
		if (response.status === 401) {
			console.warn('Access token expired. Triggering refresh handler...');

			try {
				const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });

				if (refreshRes.ok) {
					console.log('Token refreshed successfully. Retrying original request...');
					// Retry the original request with the exact same options and headers
					response = await fetch(url, { ...options, headers });
				} else {
					// If refresh failed, handle session expiration
					this.handleSessionExpired();
					throw new ApiError('SESSION_EXPIRED', 401);
				}
			} catch (refreshError) {
				this.handleSessionExpired();
				throw new ApiError('SESSION_EXPIRED', 401);
			}
		}

		// --- Error Handling (JSON or Plain Text) ---
		if (!response.ok) {
			let message = '';
			let errorData: IResponse = { success: false };
			const contentType = response.headers.get('content-type');

			if (contentType && contentType.includes('application/json')) {
				errorData = await response.json().catch(() => ({}));
				message = errorData.message || '';
			} else {
				// Read fallback error message if the server returned plain text (like some Rate Limiters)
				message = await response.text().catch(() => '');
			}

			// Explicitly handle 429 Too Many Requests
			if (response.status === 429) {
				message = message || errorData.message || 'Too Many Requests, Please try again later.';
			}

			throw new ApiError(message || `Error: ${response.status}`, response.status, errorData.errors);
		}

		return response.json() as Promise<TResponse>;
	}

	/**
	 * Helper method to redirect users on session expiration
	 */
	private handleSessionExpired(): void {
		if (typeof window !== 'undefined') {
			const locale = this.getClientLocale();
			if (window.location.pathname.includes('/user/')) {
				window.location.href = `/${locale}${APP_ROUTES.login}`;
			}
		}
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
