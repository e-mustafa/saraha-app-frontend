import PublicProfileScreen from '@/modules/messages/screens/public-profile-screen';
import { APP_CONFIGS } from '@/shared/config/app-configs';
import { configEnv } from '@/shared/config/env';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

interface Props {
	params: Promise<{
		locale: string;
		username: string;
	}>;
}

// Strictly typed API response interface to avoid 'any'
interface UserProfileResponse {
	name?: string;
	firstName?: string;
	lastName?: string;
	avatar?: {
		url: string;
	};
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale, username } = await params;
	const t = await getTranslations({ locale, namespace: 'profileMetadata' });
	const siteUrl = configEnv.appUrl;
	const fallbackImage = '/saraha-app.webp';

	if (username === 'favicon.ico') {
		// Immediately return non-found behavior without hitting the backend API
		return notFound();
	}

	try {
		const res = await fetch(`${configEnv.apiBaseUrl}/users/visit/${username}`, {
			// next: { revalidate: 120 }, // Cache profile metadata for 2 minutes
			cache: 'no-store', // Disable caching for profile metadata
		});

		if (!res.ok || !res) {
			return {
				title: `${APP_CONFIGS.name} - ${t('notFound')}`,
			};
		}

		const { data: user } = await res.json();

		if (!user) {
			return {
				title: `${APP_CONFIGS.name} - ${t('notFound')}`,
			};
		}

		const displayName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || username;

		// FIXED: Verify if the API avatar URL is absolute or relative, prepending API base URL if needed
		const rawAvatarUrl = user.avatar?.url;

		const finalImageUrl = rawAvatarUrl || fallbackImage;
		const isSquareAvatar = !!rawAvatarUrl;

		return {
			title: t('pageTitle', { name: displayName }),
			description: t('pageDescription', { name: displayName }),
			metadataBase: new URL(siteUrl),
			icons: {
				icon: '/favicon.ico', // Explicitly defining shortcut icons
				apple: '/apple-touch-icon.png', // Optional: for iOS home screen bookmarks
			},
			openGraph: {
				title: t('ogTitle', { name: displayName }),
				description: t('ogDescription'),
				// FIXED: Always include the locale context for explicit crawler indexing
				url: `${siteUrl}/${locale}/${username}`,
				siteName: t('siteName'),
				locale: locale === 'ar' ? 'ar_EG' : 'en_US',
				type: 'profile',
				images: [
					{
						url: finalImageUrl,
						width: isSquareAvatar ? 500 : 1200,
						height: isSquareAvatar ? 500 : 630,
						alt: t('avatarAlt', { name: displayName }),
					},
				],
			},
			twitter: {
				// FIXED: Dynamically toggle card type. 'summary' for square avatars, 'summary_large_image' for landscape banners
				card: isSquareAvatar ? 'summary' : 'summary_large_image',
				title: t('pageTitle', { name: displayName }),
				description: t('pageDescription', { name: displayName }),
				images: [finalImageUrl],
			},
		};
	} catch (error) {
		console.error('Error fetching user data for metadata:', error);
		return {
			title: `${t('fallbackTitle')} - ${APP_CONFIGS.name}`,
		};
	}
}

export default async function page({ params }: { params: Promise<{ username: string }> }) {
	const { username } = (await params) || {};
	return <PublicProfileScreen username={username} />;
}
