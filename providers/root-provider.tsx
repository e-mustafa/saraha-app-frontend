'use client';

import { useAppStore } from '@/store/use-app-store';
import { ThemeProvider, useTheme } from 'next-themes';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import ReactQueryProvider from './query-client-provider';

interface RootProviderProps {
	children: React.ReactNode;
	locale: string;
	direction: 'rtl' | 'ltr';
}

export function RootProvider({ children, locale, direction }: RootProviderProps) {
	const themeColor = useAppStore((state) => state.theme);
	const setLanguage = useAppStore((state) => state.setLanguage);

	// 1. مزامنة اللغة مع متجر Zustand
	useEffect(() => {
		setLanguage(locale as 'ar' | 'en');
	}, [locale, setLanguage]);

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', themeColor);
	}, [themeColor]);

	return (
		<ReactQueryProvider>
			<ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
				{children}
				<SmartToaster direction={direction} />
			</ThemeProvider>
		</ReactQueryProvider>
	);
}


function SmartToaster({ direction }: { direction: 'rtl' | 'ltr' }) {
	const { resolvedTheme } = useTheme(); // يجلب 'light' أو 'dark' ديناميكياً وبدون أي وميض أو أخطاء توافقية

	return (
		<Toaster
			position='top-center'
			richColors
			theme={resolvedTheme as 'light' | 'dark' | 'system'}
			dir={direction}
			toastOptions={{
				className:
					direction === 'rtl' ? 'font-(family-name:--font-noto-sans-arabic)' : 'font-(family-name:--font-geist-sans)',
			}}
		/>
	);
}
