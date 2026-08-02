import { Suspense } from 'react';
import PublicProfile from '../components/public-profile';
import PublicProfileSkeleton from '../components/public-profile-skeleton';

export default function PublicProfileScreen({ username }: { username: string }) {
	return (
		<Suspense fallback={<PublicProfileSkeleton />}>
			<PublicProfile username={username} />
		</Suspense>
	);
}
