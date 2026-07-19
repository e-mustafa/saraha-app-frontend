import { routing } from '@/i18n/routing';
import { AuthErrorWatcher } from '@/providers/auth-error-watcher';
import { APP_CONFIGS } from '@/shared/config/app-configs';
import { configEnv } from '@/shared/config/env';
import { DirectionProvider } from '@radix-ui/react-direction';
import { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Geist, Geist_Mono, Noto_Sans_Arabic } from 'next/font/google';
import { RootProvider } from '../../providers/root-provider';
import '../globals.css';

const NotoSansArabic = Noto_Sans_Arabic({
	variable: '--font-noto-sans-arabic',
	subsets: ['arabic'],
});

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

type Props = {
	params: Promise<{ locale: string }>;
};

// Dynamic metadata generator for the localized layout
export async function generateMetadata({ params }: Props): Promise<Metadata> {
	// Await the asynchronous params per Next.js 15+ standards
	const { locale } = await params;

	// Fetch server-side translations dynamically targeting a 'Metadata' namespace in your JSON
	const t = await getTranslations({ locale, namespace: 'metadata' });
	const siteUrl = configEnv.appUrl;
	const imageUrl = '/saraha-app.webp';
	return {
		title: t('title'),
		description: t('description'),
		metadataBase: new URL(siteUrl),
		icons: {
			icon: '../favicon.ico', // Explicitly defining shortcut icons
			apple: '../apple-touch-icon.png', // Optional: for iOS home screen bookmarks
		},
		openGraph: {
			title: t('title'),
			description: t('description'),
			url: `${siteUrl}/${locale}`,
			siteName: t('siteName'),
			locale: locale === 'ar' ? 'ar_EG' : 'en_US',
			type: 'website',
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: t('title'), // Highly recommended for SEO accessibility
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title: t('title'),
			description: t('description'),
			images: [imageUrl],
		},
	};
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
	let { locale } = await params;

	if (!hasLocale(routing.locales, locale)) {
		// notFound();
		locale = routing.defaultLocale;
	}

	const messages = await getMessages();
	const direction = locale === 'ar' ? 'rtl' : 'ltr';
	// const isRTL = locale === 'ar';

	const storageKey = `${APP_CONFIGS.name}-app-storage`;

	const themeScript = `
      (function() {
         try {
            var storage = localStorage.getItem('${storageKey}');
            if (storage) {
               var parsed = JSON.parse(storage);
               if (parsed && parsed.state && parsed.state.theme) {
                  document.documentElement.setAttribute('data-theme', parsed.state.theme);
               }
            }
         } catch (e) {}
      })();
   `;

	return (
		<html
			lang={locale}
			dir={direction}
			className={`${NotoSansArabic.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeScript }} />
			</head>
			{/* <body
				className={`${direction === 'rtl' ? 'font-(family-name:--font-noto-sans-arabic)' : 'font-(family-name:--font-geist-sans)'} min-h-full flex flex-col`}
			> */}
			<body className='antialiased'>
				<RootProvider locale={locale} direction={direction}>
					<NextIntlClientProvider messages={messages}>
						<DirectionProvider dir={direction}>
							{children}
							<AuthErrorWatcher />
						</DirectionProvider>
					</NextIntlClientProvider>
				</RootProvider>
			</body>
		</html>
	);
}
