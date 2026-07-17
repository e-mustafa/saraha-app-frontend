import { IResponse } from '@/shared/types/index';
import { apiClient } from '@/shared/utils/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Pass the message ID as an argument to the custom hook
export default function useMarkMessagePublic(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		// 1. Add the id dynamically to the mutationKey array
		mutationKey: ['messages', id, 'public'],

		// 2. You no longer need to pass the id to the mutate function, it's loaded from closure
		mutationFn: async () => {
			const response = await apiClient.patch<IResponse<{ isPublic: boolean }>>(`/messages/${id}/public`, {});
			return response;
		},
		retry: 1,
		onError: (error) => {
			// Handle mutation errors here
		},
		onSuccess: (res) => {
			// Invalidate queries starting with 'messages' to refresh the UI
			queryClient.invalidateQueries({ queryKey: ['messages'] });
		},
	});
}
