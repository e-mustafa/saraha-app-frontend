import { IResponse } from '@/shared/types/index';
import { ApiError } from '@/shared/utils/app-error';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// تعريف كود الـ Meta للحصول على Type Safety كامل
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
					// منع إعادة المحاولة إذا كان الخطأ من صلاحيات المستخدم (401 أو 403)
					if (error instanceof ApiError && [401, 403].includes(error.status)) return false;
					return failureCount < 1;
				},
			},
		},

		queryCache: new QueryCache({
			onError: (error, query) => {
				// التحقق مما إذا كانت الـ query تمنع ظهور التوست عمداً
				if (query.meta?.showErrorToast === false) return;

				if (error instanceof ApiError) {
					toast.error(error.message);
				}
			},
		}),

		mutationCache: new MutationCache({
			onSuccess: (res: IResponse, variables, context, mutation) => {
				// التحقق مما إذا كانت العملية تمنع توست النجاح
				if (mutation.meta?.showSuccessToast === false) return;

				// إذا تم تمرير رسالة نجاح مخصصة في الـ Meta نستخدمها، وإلا نأخذ القادمة من الباك إند
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
					toast.error(error.message || 'حدث خطأ غير متوقع');
				}
			},
		}),
	});
};
