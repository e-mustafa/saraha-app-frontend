import { IResponse } from '@/shared/types/index';
import { apiClient } from '@/shared/utils/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserProfile } from '../types/database';
import { useRouter } from '@/i18n/navigation';
import { APP_ROUTES } from '@/shared/config/app-configs';

export default function useBlockUser(id: string) {
	const queryClient = useQueryClient();
	const router = useRouter()

	return useMutation({
		mutationKey: ['profile', 'block-user', id],
		mutationFn: async () => {
			const response = await apiClient.patch<IResponse<{ fromFavorite: boolean }>>(`/users/block/${id}`, {});
			return response;
		},
		retry: 1,
		onError: () => {
			// console.error('Error marking message as favorite:', error);
			// toast.error(error.message || 'Failed to mark message as favorite');
		},
		onSuccess: (res) => {
			// toast.success(res?.message || 'Message updated successfully');

			// queryClient.invalidateQueries({ queryKey: ['profile'] });
			queryClient.setQueryData(['profile', 'block-user', id], (oldData: UserProfile) => {
				return {
					...oldData,
					...res.data,
				};
			});

			router.push(APP_ROUTES.messages)
		},
	});
}
