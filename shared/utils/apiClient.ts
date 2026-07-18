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

	// Thread-safe locking mechanism for concurrent requests
	private isRefreshing = false;
	private refreshPromise: Promise<boolean> | null = null;

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
			throw new ApiError('Network error, please check your internet connection', 0);
		}

		// --- Actual 401 Handling Logic (Thread-safe Silent Refresh) ---
		if (response.status === 401) {
			// Prevent absolute infinite loops if the refresh call itself throws a 401
			if (endpoint.includes('/auth/refresh')) {
				throw new ApiError('SESSION_EXPIRED', 401);
			}

			console.warn('Access token expired. Handling secure token refresh...');

			// Safeguard parallel requests by queuing them behind a single shared promise
			if (!this.isRefreshing) {
				this.isRefreshing = true;
				this.refreshPromise = (async () => {
					try {
						const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
						return refreshRes.ok;
					} catch {
						return false;
					} finally {
						this.isRefreshing = false;
						this.refreshPromise = null;
					}
				})();
			}

			const isRefreshed = await this.refreshPromise;

			if (isRefreshed) {
				console.log('Token refreshed successfully. Retrying original request...');
				// Re-execute original request with updated cookie state
				response = await fetch(url, { ...options, headers });
			} else {
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
				message = await response.text().catch(() => '');
			}

			if (response.status === 429) {
				message = message || errorData.message || 'Too Many Requests, Please try again later.';
			}

			throw new ApiError(message || `Error: ${response.status}`, response.status, errorData.errors);
		}

		return response.json() as Promise<TResponse>;
	}

	/**
	 * Helper method to sync client auth states and redirect on session expiration
	 */
	private handleSessionExpired(): void {
		if (typeof window !== 'undefined') {
			// Notify Context/State Providers to globally clean user auth status
			window.dispatchEvent(new CustomEvent('auth:session-expired'));

			const locale = this.getClientLocale();
			// Only redirect if within protected administrative routes
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
