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
				retry: (failureCount, error) => {
					// Prevent retry if error is auth-related (401 or 403)
					if (error instanceof ApiError && [401, 403].includes(error.status)) return false;
					return failureCount < 1;
				},
			},
		},

		queryCache: new QueryCache({
			onError: (error, query) => {
				// Check if the query intentionally prevents showing the toast
				if (query.meta?.showErrorToast === false) return;

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
