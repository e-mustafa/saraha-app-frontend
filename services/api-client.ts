import { configEnv } from "@/config/env.js";

const ENABLE_MOCKS = configEnv.enableMocks;

interface ApiResponse<T> {
	data?: T;
	error?: string;
	status: number;
}

class ApiClient {
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	async get<T>(endpoint: string): Promise<ApiResponse<T>> {
		if (ENABLE_MOCKS) {
			return this.mockResponse<T>(endpoint);
		}

		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json();
			return {
				data,
				status: response.status,
			};
		} catch (error) {
			return {
				error: error instanceof Error ? error.message : 'Unknown error',
				status: 500,
			};
		}
	}

	async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
		if (ENABLE_MOCKS) {
			return this.mockResponse<T>(endpoint);
		}

		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});

			const data = await response.json();
			return {
				data,
				status: response.status,
			};
		} catch (error) {
			return {
				error: error instanceof Error ? error.message : 'Unknown error',
				status: 500,
			};
		}
	}

	async put<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
		if (ENABLE_MOCKS) {
			return this.mockResponse<T>(endpoint);
		}

		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});

			const data = await response.json();
			return {
				data,
				status: response.status,
			};
		} catch (error) {
			return {
				error: error instanceof Error ? error.message : 'Unknown error',
				status: 500,
			};
		}
	}

	async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
		if (ENABLE_MOCKS) {
			return this.mockResponse<T>(endpoint);
		}

		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json();
			return {
				data,
				status: response.status,
			};
		} catch (error) {
			return {
				error: error instanceof Error ? error.message : 'Unknown error',
				status: 500,
			};
		}
	}

	private async mockResponse<T>(endpoint: string): Promise<ApiResponse<T>> {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Mock responses based on endpoint
		if (endpoint.includes('/auth/login')) {
			return {
				data: { token: 'mock-token', user: { id: 1, email: 'user@example.com' } } as T,
				status: 200,
			};
		}

		if (endpoint.includes('/auth/register')) {
			return {
				data: { token: 'mock-token', user: { id: 1, email: 'user@example.com' } } as T,
				status: 201,
			};
		}

		if (endpoint.includes('/messages')) {
			return {
				data: {
					messages: [{ id: 1, content: 'Hello!', createdAt: new Date().toISOString() }],
				} as T,
				status: 200,
			};
		}

		return {
			data: {} as T,
			status: 200,
		};
	}
}

export const apiClient = new ApiClient(configEnv.apiBaseUrl);
