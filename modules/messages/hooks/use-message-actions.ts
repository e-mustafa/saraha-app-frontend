import { useMutation, useQueryClient, useIsMutating } from '@tanstack/react-query';
import { apiClient } from '@/shared/utils/apiClient';
import { IResponse } from '@/shared/types/index';

export default function useMessageActions(id: string) {
	const queryClient = useQueryClient();

	// 1. Favorite action mutation
	const favoriteMutation = useMutation({
		mutationKey: ['messages', id, 'favorite'],
		mutationFn: async () => {
			return await apiClient.patch<IResponse<{ fromFavorite: boolean }>>(`/messages/${id}/favorite`, {});
		},
		retry: 1,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['messages'] });
		},
	});

	// 2. Public toggle action mutation
	const publicMutation = useMutation({
		mutationKey: ['messages', id, 'public'],
		mutationFn: async () => {
			return await apiClient.patch<IResponse<{ isPublic: boolean }>>(`/messages/${id}/public`, {});
		},
		retry: 1,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['messages'] });
		},
	});

	// 3. Delete action mutation
	const deleteMutation = useMutation({
		mutationKey: ['messages', id, 'delete'],
		mutationFn: async () => {
			return await apiClient.delete<IResponse<null>>(`/messages/${id}`);
		},
		retry: 1,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['messages'] });
		},
	});

	// 4. Unified loading state for any active mutation on this message ID
	const activeMutationsCount = useIsMutating({
		mutationKey: ['messages', id],
	});
	const isAnyActionPending = activeMutationsCount > 0;

	return {
		toggleFavorite: favoriteMutation.mutate,
		togglePublic: publicMutation.mutate,
		deleteMessage: deleteMutation.mutate,
		isAnyActionPending,
		isDeleting: deleteMutation.isPending,
		isFavoritePending: favoriteMutation.isPending,
		isPublicPending: publicMutation.isPending,
	};
}
