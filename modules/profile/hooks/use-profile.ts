import { IResponse } from '@/shared/types';
import { apiClient } from '@/shared/utils/apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ProfileInput } from '../schemas/profile.schema';
import { UserProfile } from '../types/database';

export default function useProfile() {
	const queryClient = useQueryClient();

	// 1. جلب بيانات الملف الشخصي (Fetching)
	const profileQuery = useQuery({
		queryKey: ['profile'],
		queryFn: async () => {
			// سيمر الطلب عبر الـ Proxy الذي أصلحناه في الخطوة السابقة ليُحقن التوكن تلقائياً
			const response = await apiClient.get<IResponse<UserProfile>>(`/users/profile`);
			return response.data;
		},
		retry: 1,
	});

	// 2. تحديث بيانات الملف الشخصي (Updating)
	const updateMutation = useMutation({
		mutationKey: ['updateProfile'],
		mutationFn: async (data: ProfileInput) => {
			// تأكد من أن الـ apiClient الخاص بك يدعم دالة patch ويمرر الـ headers كما فعلنا مع بقية الديكورات
			const response = await apiClient.patch<IResponse<UserProfile>>(`/users/profile`, data);
			return response;
		},
		onSuccess: () => {
			// عمل Invalidate لكاش الـ profile ليقوم الـ useQuery بإعادة جلب البيانات المحدثة فوراً
			queryClient.invalidateQueries({ queryKey: ['profile'] });
		},
		onError: (error) => {
			console.error('Failed to update profile:', error);
		},
	});

	// 3. تصدير البيانات والوظائف بشكل منظم وسهل الاستخدام
	return {
		// بيانات جلب الملف الشخصي وحالاته
		profile: profileQuery.data,
		isLoading: profileQuery.isLoading,
		isError: profileQuery.isError,
		error: profileQuery.error,
		refetchProfile: profileQuery.refetch,

		// وظائف وحالات التحديث
		updateProfile: updateMutation.mutate,
		updateProfileAsync: updateMutation.mutateAsync,
		isUpdating: updateMutation.isPending, // في الإصدارات الحديثة لـ React Query نستخدم isPending بدلاً من isLoading للميوتيشن
	};
}
