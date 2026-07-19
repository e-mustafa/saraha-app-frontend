import { routing } from '@/i18n/routing';
import { Button } from '@/shared/components/ui/button';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { ReactNode } from 'react';

export default async function GlobalNotFound(): Promise<ReactNode> {
	// Access the cookie store asynchronously to detect user preference
	const cookieStore = await cookies();

	// Fallback to your default locale (e.g., 'ar') if the cookie is not set yet
	const locale = cookieStore.get('NEXT_LOCALE')?.value || routing.defaultLocale || 'ar';

	// Fetch server-side translations dynamically for the root fallback context
	const t = await getTranslations({ locale, namespace: 'notFoundPage' });

	// Determine text direction dynamically based on the detected locale
	const dir = locale === 'ar' ? 'rtl' : 'ltr';

	return (
		<html lang={locale} dir={dir}>
			<body className='bg-background text-foreground antialiased'>
				<div className='flex min-h-screen flex-col items-center justify-center p-4 text-center space-y-4 font-sans'>
					<h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>{t('title')}</h1>
					<p className='text-base text-muted-foreground max-w-md'>{t('description')}</p>
					<Button variant='outline' size='lg' asChild>
						{/* Redirect the user to their dynamic home route with the correct locale context */}
						<Link href={`/${locale}`}>{t('backHome')}</Link>
					</Button>
				</div>
			</body>
		</html>
	);
}
