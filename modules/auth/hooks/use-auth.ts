import { useRouter } from '@/i18n/navigation';
import { UserProfile } from '@/modules/profile/types/database';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { IResponse } from '@/shared/types/index';
import { apiClient } from '@/shared/utils/apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { logoutAction } from '../actions';

export function useAuth() {
	const queryClient = useQueryClient();
	const router = useRouter();

	const {
		data: user,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['authUser', 'profile'],
		queryFn: async () => {
			// الطلب يمر عبر الـ Proxy ليأخذ الـ Authorization Header تلقائياً
			const response = await apiClient.get<IResponse<UserProfile>>('/users/profile');
			return response.data as UserProfile; // نفترض أن البيانات تعود هنا
		},
		meta: { showErrorToast: false },
		// إعدادات هامة لأفضل تجربة مستخدم:
		staleTime: 1000 * 60 * 15, // البيانات تعتبر طازجة لمدة 15 دقيقة ولا يعاد طلبها طالما يتنقل المستخدم
		gcTime: 1000 * 60 * 60, // الاحتفاظ بالبيانات في الكاش المخفي لمدة ساعة
		retry: false, // إذا فشل الطلب (مثلا 401) لا تعيد المحاولة لتجنب الضغط على السيرفر
	});

	// 2. دالة تسجيل الخروج كـ Mutation لإدارة حالات الأزرار والـ UI
	const logoutMutation = useMutation({
		mutationFn: async (fromAll: boolean = false) => {
			return await logoutAction(fromAll);
		},
		onSuccess: (res) => {
			if (res.success) {
				// ✨ السحر هنا: تنظيف كاش الـ React Query بالكامل لمنع تسريب أي بيانات للمستخدم القادم
				queryClient.clear();

				// توجيه فوري لصفحة تسجيل الدخول
				router.push(APP_ROUTES.login);

				// عمل refresh خفيف لتحديث السيرفر كومبوننتس (Server Components) لكي تشعر بحذف الكوكيز
				router.refresh();
			} else {
				// toast.error(res.message);
			}
		},
		onError: () => {
			// toast.error('حدث خطأ أثناء محاولة تسجيل الخروج');
		},
	});

	return {
		user,
		isLoading,
		isAuthed: !!user,

		// تصدير دالة تسجيل الخروج وحالة التحميل الخاصة بها للـ UI
		logout: logoutMutation.mutate,
		isLoggingOut: logoutMutation.isPending, // استخدامها لعمل Loading spinner في زر الخروج
	};
}
