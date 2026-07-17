import { IResponse } from '@/shared/types/index';
import { ApiError } from '@/shared/utils/app-error';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Register custom metadata types for full Type Safety
declare module '@tanstack/react-query' {
	interface Register {
		defaultError: Error | ApiError;
		mutationMeta: {
			showSuccessToast?: boolean;
			showErrorToast?: boolean;
			successMessage?: string;
		};
		queryMeta: {
			showErrorToast?: boolean;
		};
	}
}

export const createQueryClient = () => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60 * 5,
				refetchOnWindowFocus: false,
				// Disable automatic refetching when network reconnects to avoid request spamming
				refetchOnReconnect: false,

				retry: (failureCount, error) => {
					// Prevent retry if error is auth-related (401, 403) or rate-limited (429)
					if (error instanceof ApiError && [401, 403, 429].includes(error.status)) {
						return false;
					}

					// Retry up to 2 times for network errors (status 0) or server errors (50x)
					return failureCount < 2;
				},

				// Implement Exponential Backoff: 1s -> 2s -> 4s
				retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			},
		},

		queryCache: new QueryCache({
			onError: (error, query) => {
				if (query.meta?.showErrorToast === false) return;

				// Optional: Prevent spamming the UI with toasts for 429 errors if triggered globally
				if (error instanceof ApiError) {
					toast.error(error.message);
				}
			},
		}),

		mutationCache: new MutationCache({
			onSuccess: (data, variables, context, mutation) => {
				// Check if the mutation prevents the success toast
				if (mutation.meta?.showSuccessToast === false) return;

				// Safely assert the global 'unknown' data to our standard API response structure without using 'any'
				const res = data as IResponse<unknown>;

				// Use custom success message from Meta if provided, fallback to backend message
				const customMessage = mutation.meta?.successMessage;
				if (customMessage || res?.message) {
					toast.success(customMessage || res.message || '');
				}
			},
			onError: (error, variables, context, mutation) => {
				if (mutation.meta?.showErrorToast === false) return;

				console.error('Mutation global error:', error);

				if (error instanceof ApiError && error.message !== 'SESSION_EXPIRED') {
					toast.error(error.message);
				} else {
					toast.error(error.message || 'An unexpected error occurred');
				}
			},
		}),
	});
};
