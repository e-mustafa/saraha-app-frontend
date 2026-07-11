import { IResponse } from '@/shared/types';
import { apiClient } from '@/shared/utils/apiClient';
import { useQuery } from '@tanstack/react-query';
import { UserProfile } from '../types/database';

export const fetchPublicProfile = async (username: string) => {
	const response = await apiClient.get<IResponse<Partial<UserProfile>>>(`/users/visit/${username}`);
	return response.data as Partial<UserProfile>;
};

// 2. الـ Custom Hook الاحترافي
export const usePublicProfile = (username: string) => {
	return useQuery({
		queryKey: ['public-profile', username],
		queryFn: () => fetchPublicProfile(username),
		enabled: !!username, // لا تنفذ الطلب إذا كان اسم المستخدم فارغاً
		retry: 1,
	});
};
