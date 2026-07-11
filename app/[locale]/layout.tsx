import { routing } from '@/i18n/routing';
import { AuthErrorWatcher } from '@/providers/auth-error-watcher';
import { ZodConfigInitializer } from '@/providers/zod-config-initializer';
import { APP_CONFIGS } from '@/shared/config/app-configs';
import { DirectionProvider } from '@radix-ui/react-direction';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
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

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
	let { locale } = await params;
	console.log('locale---', locale);
	console.log('routing.defaultLocale---', routing.defaultLocale);

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
							<ZodConfigInitializer>
								{children}
								<AuthErrorWatcher />
							</ZodConfigInitializer>
						</DirectionProvider>
					</NextIntlClientProvider>
				</RootProvider>
			</body>
		</html>
	);
}
