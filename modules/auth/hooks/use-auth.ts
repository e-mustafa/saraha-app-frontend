import { useRouter } from '@/i18n/navigation';
import { UserProfile } from '@/modules/profile/types/database';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { IResponse } from '@/shared/types/index';
import { apiClient } from '@/shared/utils/apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { logoutAction } from '../actions';

export function useAuth() {
	const queryClient = useQueryClient();
	const router = useRouter();

	const { data: user, isLoading } = useQuery({
		queryKey: ['authUser', 'profile'],
		queryFn: async () => {
			const response = await apiClient.get<IResponse<UserProfile>>('/users/profile');
			return response.data as UserProfile;
		},
		meta: { showErrorToast: false },
		staleTime: 1000 * 60 * 15, // 15 minutes of fresh data state
		gcTime: 1000 * 60 * 60, // 1 hour garbage collection
		retry: false, // Avoid hammering auth endpoints on 401s
	});

	// logout mutation function
	const logoutMutation = useMutation({
		mutationFn: async (fromAll: boolean = false) => {
			return await logoutAction(fromAll);
		},
		onSuccess: (res) => {
			if (res.success) {
				// Target specific user data instead of aggressive clear to preserve public view caches
				queryClient.setQueryData(['authUser', 'profile'], null);
				// ✨ redirect to login page immediately
				router.push(APP_ROUTES.login);

				// ✨ refresh to update server components (Server Components) to feel the cookie deletion
				router.refresh();
			}
		},
	});

	useEffect(() => {
		const handleLogout = () => {
			console.log('Session expired event received. Client auth state synchronized.');

			// Invalidate only the user profile state securely
			queryClient.setQueryData(['authUser', 'profile'], null);

			if (typeof window !== 'undefined') {
				// CRITICAL: Only redirect if the user is currently navigating a protected route layout
				if (window.location.pathname.includes('/user/')) {
					router.push(APP_ROUTES.login);
					router.refresh();
				}
			}
		};

		window.addEventListener('auth:session-expired', handleLogout);
		return () => window.removeEventListener('auth:session-expired', handleLogout);
	}, [router, queryClient]);

	return {
		user,
		isLoading,
		isAuthed: !!user,

		logout: logoutMutation.mutate,
		isLoggingOut: logoutMutation.isPending,
	};
}
