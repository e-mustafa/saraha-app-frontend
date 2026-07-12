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
		// error,
	} = useQuery({
		queryKey: ['authUser', 'profile'],
		queryFn: async () => {
			// request will be sent through the proxy to include the Authorization header automatically
			const response = await apiClient.get<IResponse<UserProfile>>('/users/profile');
			return response.data as UserProfile;
		},
		meta: { showErrorToast: false },
		// staleTime: 15 minutes - data is considered fresh for 15 minutes, no need to refetch while user navigates
		// gcTime: 1 hour - keep data in cache for 1 hour even when not in use
		// retry: false - don't retry on failure (e.g., 401) to avoid server pressure
		staleTime: 1000 * 60 * 15,
		gcTime: 1000 * 60 * 60,
		retry: false,
	});

	// logout mutation function
	const logoutMutation = useMutation({
		mutationFn: async (fromAll: boolean = false) => {
			return await logoutAction(fromAll);
		},
		onSuccess: (res) => {
			if (res.success) {
				// ✨ clear all React Query cache to avoid data leakage
				queryClient.clear();

				// ✨ redirect to login page immediately
				router.push(APP_ROUTES.login);

				// ✨ refresh to update server components (Server Components) to feel the cookie deletion
				router.refresh();
			} else {
				// toast.error(res.message);
			}
		},
		// onError: () => {
		// 	// toast.error('حدث خطأ أثناء محاولة تسجيل الخروج');
		// },
	});

	return {
		user,
		isLoading,
		isAuthed: !!user,

		logout: logoutMutation.mutate,
		isLoggingOut: logoutMutation.isPending,
	};
}
