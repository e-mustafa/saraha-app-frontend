import PublicProfileScreen from '@/modules/messages/screens/public-profile-screen';
import { APP_CONFIGS } from '@/shared/config/app-configs';
import { configEnv } from '@/shared/config/env';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

// Define strict interface for the expected API user object to prevent implicit 'any'
interface UserProfileResponse {
	name?: string;
	firstName?: string;
	lastName?: string;
	avatar: {
		url?: string;
	};
}

// Explicitly type the asynchronous route parameters matching Next.js 15+ standards
type Props = {
	params: Promise<{ locale: string; username: string }>;
};

// Generates dynamic and localized metadata for the explicit user profile
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	// Await and destructure both route segments dynamically
	const { locale, username } = await params;

	// Initialize server-side translations for the specific dynamic profile namespace
	const t = await getTranslations({ locale, namespace: 'profileMetadata' });
	const siteUrl = configEnv.appUrl;

	try {
		// Fetch profile data with optimization strategy (e.g., ISR or time-based revalidation if preferred)
		const res = await fetch(`${configEnv.apiBaseUrl}/users/visit/${username}`, {
			next: { revalidate: 120 }, // Caches profile metadata for 2 minutes to reduce DB load
		});

		// Handle non-200 API responses gracefully
		if (!res.ok) {
			return {
				title: `${APP_CONFIGS.name} - ${t('notFound')}`,
			};
		}

		const user: UserProfileResponse = await res.json();

		if (!user) {
			return {
				title: `${APP_CONFIGS.name} - ${t('notFound')}`,
			};
		}

		// Safely build display name with fallbacks
		const displayName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || username;

		// Switch dynamic fallback image depending on the locale if the user has no avatar
		const fallbackImage = '/saraha-app.webp';

		return {
			title: t('pageTitle', { name: displayName }),
			description: t('pageDescription', { name: displayName }),
			metadataBase: new URL(siteUrl),
			openGraph: {
				title: t('ogTitle', { name: displayName }),
				description: t('ogDescription'),
				url: `${siteUrl}/${locale}/${username}`,
				// siteName: APP_CONFIGS.name,
				siteName: t('siteName'),
				locale: locale === 'ar' ? 'ar_EG' : 'en_US',
				type: 'profile', // Utilizing specific OpenGraph type for profiles
				images: [
					{
						url: user.avatar?.url || fallbackImage,
						width: user.avatar?.url ? 500 : 1200, // Dynamic dimensions based on image type
						height: user.avatar?.url ? 500 : 630,
						alt: t('avatarAlt', { name: displayName }),
					},
				],
			},
			twitter: {
				card: 'summary_large_image',
				title: t('pageTitle', { name: displayName }),
				description: t('pageDescription', { name: displayName }),
				images: [user.avatar?.url || fallbackImage],
			},
		};
	} catch (error) {
		// Strict recovery fallback in case of connection dropouts or server errors
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
