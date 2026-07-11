import PublicProfileScreen from '@/modules/messages/screens/public-profile-screen';

export default async function page({ params }: { params: Promise<{ username: string }> }) {
	const { username } = (await params) || {};
	return <PublicProfileScreen username={username} />;
}
