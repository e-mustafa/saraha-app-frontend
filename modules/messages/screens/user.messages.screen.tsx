import { Suspense } from 'react';
import UserProfileSkeleton from '../../profile/components/user.profile-skeleton';
import UserMessages from '../components/user-messages';

export default function UserMessagesScreen() {
	// const { data: profile } = await apiServer.get<UserProfile>('/users/profile');

	// console.log('UserProfileScreen profile', profile);

	return (
		<Suspense fallback={<UserProfileSkeleton />}>
			<UserMessages />
		</Suspense>
	);
}
