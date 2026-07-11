import UserProfileSkeleton from '@/modules/profile/components/user.profile-skeleton';
import { Suspense } from 'react';
import PublicProfile from '../components/public-profile';

export default function PublicProfileScreen({ username }: { username: string }) {
	return (
		<Suspense fallback={<UserProfileSkeleton />}>
			<PublicProfile username={username} />
		</Suspense>
	);
}
