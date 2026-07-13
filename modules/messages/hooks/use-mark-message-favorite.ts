import { IResponse } from '@/shared/types/index';
import { apiClient } from '@/shared/utils/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useMarkMessageFavorite() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['messages', 'favorite'],
		mutationFn: async (id: string) => {
			const response = await apiClient.patch<IResponse<{ fromFavorite: boolean }>>(`/messages/${id}/favorite`, {});
			return response;
		},
		retry: 1,
		onError: () => {
			// console.error('Error marking message as favorite:', error);
			// toast.error(error.message || 'Failed to mark message as favorite');
		},
		onSuccess: () => {
			// toast.success(res?.message || 'Message updated successfully');

			// 3. عمل Invalidate لكل الكاش الذي يبدأ بكلمة 'messages'
			// هذا سيجعل الـ useQuery في الصفحة تقوم بإعادة جلب البيانات فورًا
			queryClient.invalidateQueries({ queryKey: ['messages'] });
		},
	});
}
