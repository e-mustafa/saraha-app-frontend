// import { APP_ROUTES } from '@/config/app-configs';
// import { apiClient } from '@/services/api-client';
// import { ApiError } from '@/utils/app-error';
// import { useMutation } from '@tanstack/react-query';
// import { useTranslations } from 'next-intl';
// import { useRouter } from 'next/navigation';
// import { toast } from 'sonner';
// import { IResponse } from '../types';

// export function useLogout() {
// 	const router = useRouter();
// 	const t = useTranslations('auth');
// 	return useMutation<IResponse, ApiError, { fromAll: boolean }>({
// 		mutationFn: async (data) => {
// 			// const { fromAll } = data;
// 			const endpoint = data.fromAll ? '/auth/logout-all' : '/auth/logout';
// 			const res = await apiClient.post<IResponse>(endpoint, {});
// 			return res;
// 		},
// 		// meta: { showSuccessToast: false }
// 		// meta: { successMessage: 'تم حذف العنصر بنجاح من سلتك' }
// 		onSuccess: (res) => {
// 			// toast.success(res.message || t('logout.success'));
// 			router.push(APP_ROUTES.login);
// 		},
// 		// onError: (error) => {
// 		// 	toast.error(error.message || t('logout.error'));
// 		// },
// 	});
// }
