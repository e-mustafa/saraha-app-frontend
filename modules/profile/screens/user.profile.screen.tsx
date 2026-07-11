import { Suspense } from 'react';
import UserProfileComponent from '../components/user-profile-component';
import UserProfileSkeleton from '../components/user.profile-skeleton';

export default async function UserProfileScreen() {
	// const { data: profile } = await apiServer.get<UserProfile>('/users/profile');

	// console.log('UserProfileScreen profile', profile);

	return (
		<Suspense fallback={<UserProfileSkeleton />}>
			<UserProfileComponent />
		</Suspense>
	);
}
