import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '../../components/theme-provider'; // تأكد من صحة المسار
import '../globals.css';
// import { ThemeProvider } from '@/components/theme-provider.js';

const locales = ['en', 'ar'];

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	// عمل await للـ params لقراءة الـ locale بأمان في Next.js 15/16
	const { locale } = await params;

	console.log('Layout locale:', locale);

	if (!locales.includes(locale)) {
		notFound();
	}

	// getMessages() ستقرأ الـ locale تلقائياً الآن بعد إصلاح ملف request.ts
	const messages = await getMessages();
	const isRTL = locale === 'ar';

	return (
		<html
			lang={locale}
			dir={isRTL ? 'rtl' : 'ltr'}
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			<body className='min-h-full flex flex-col'>
				<ThemeProvider attribute='class' defaultTheme='violet' enableSystem disableTransitionOnChange>
					<NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
