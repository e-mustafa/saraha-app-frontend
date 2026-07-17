import PublicProfileScreen from '@/modules/messages/screens/public-profile-screen';
import { APP_CONFIGS } from '@/shared/config/app-configs';
import { configEnv } from '@/shared/config/env';
import { Metadata } from 'next';

interface Props {
	params: Promise<{ username: string }>;
}

// Generates dynamic metadata on the server side
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { username } = await params;

	try {
		// Fetch user profile data from your database or API
		const res = await fetch(`${configEnv.apiBaseUrl}/users/visit/${username}`);
		const user = await res.json();

		if (!user) {
			return {
				title: `User Not Found - ${APP_CONFIGS.name}`,
			};
		}

		const displayName = user.name || `${user.firstName} ${user.lastName}`;
		return {
			title: `Send a secret message to ${displayName}`,
			description: `Write a constructive critique or honest advice to ${displayName} without them knowing who you are!`,
			openGraph: {
				title: `Share your thoughts with ${displayName}`,
				description: 'Click the link to send your anonymous honest message.',
				images: [
					{
						url: user.avatar.url || '/saraha-app-logo.png',
						width: 800,
						height: 800,
						alt: `${displayName}'s profile picture`,
					},
				],
			},
		};
	} catch (error) {
		// Fallback metadata in case of server error
		console.error('Error fetching user data for metadata:', error);
		return {
			title: `Send an Anonymous Message - ${APP_CONFIGS.name}`,
		};
	}
}

export default async function page({ params }: { params: Promise<{ username: string }> }) {
	const { username } = (await params) || {};
	return <PublicProfileScreen username={username} />;
}
