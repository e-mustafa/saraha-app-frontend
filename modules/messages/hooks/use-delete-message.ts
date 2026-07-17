import { IResponse } from '@/shared/types/index';
import { apiClient } from '@/shared/utils/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useDeleteMessage(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: ['messages', id, 'delete'],
		mutationFn: async () => {
			const response = await apiClient.delete<IResponse<{ fromFavorite: boolean }>>(`/messages/${id}`);
			return response;
		},
		retry: 1,
		onError: (error) => {
			// console.error('Error marking message as favorite:', error);
			// toast.error(error.message || 'Failed to mark message as favorite');
		},
		onSuccess: (res) => {
			// toast.success(res?.message || 'Message updated successfully');

			// 3. عمل Invalidate لكل الكاش الذي يبدأ بكلمة 'messages'
			// هذا سيجعل الـ useQuery في الصفحة تقوم بإعادة جلب البيانات فورًا
			queryClient.invalidateQueries({ queryKey: ['messages'] });
		},
	});
}
