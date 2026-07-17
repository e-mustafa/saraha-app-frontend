'use client';

import { useAppStore } from '@/store/use-app-store';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function UserSettingsComponent() {
	const t = useTranslations();
	const router = useRouter();
	const pathname = usePathname();
	const locale = useLocale();

	const { theme: brandTheme, setTheme: setBrandTheme } = useAppStore();
	const { theme: displayMode, setTheme: setDisplayMode } = useTheme();
	const { language, setLanguage } = useAppStore();

	// state to ensure the page is fully loaded on the browser to prevent Hydration Error
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		// eslint-disable-next-line
		setMounted(true);
	}, []);

	const handleBrandThemeChange = (newTheme: 'violet' | 'emerald' | 'sunset' | 'ocean') => {
		setBrandTheme(newTheme);
		toast.success(t('settings.alerts.themePaletteChanged', { theme: t(`theme.palettes.${newTheme}`) }));
	};

	const handleDisplayModeChange = (mode: 'light' | 'dark' | 'system') => {
		setDisplayMode(mode);
		toast.success(t('settings.alerts.displayModeSet', { mode: t(`theme.modes.${mode}`) }));
	};

	const handleLanguageChange = (newLanguage: 'ar' | 'en') => {
		setLanguage(newLanguage);
		const currentPath = pathname.replace(/^\/(ar|en)/, '');
		router.push(`/${locale}${currentPath}`);
		toast.success(t('settings.alerts.languageSet', { language: newLanguage === 'ar' ? 'العربية' : 'English' }));
	};

	if (!mounted) {
		// يمكنك إرجاع هيكل فارغ أو شاشة تحميل بسيطة (Skeleton) لمنع الوميض
		return <div className='min-h-full opacity-0' />;
	}

	return (
		<div className='min-h-full relative overflow-hidden'>
			<div className='absolute inset-0 bg-linear-to-br from-brand-primary/10 via-brand-secondary/5 to-transparent animate-gradient-xy' />

			<div className='relative mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8'>
				<div className='mb-8'>
					<h1 className='text-4xl font-bold tracking-tight text-foreground mb-2'>{t('settings.title')}</h1>
					<p className='text-gray-500'>{t('settings.description')}</p>
				</div>

				<div className='space-y-8'>
					{/* البراند ثيم */}
					<div className='backdrop-blur-xl bg-card-glass/80 rounded-2xl shadow-2xl border border-brand-primary/20 p-8'>
						<h2 className='text-xl font-semibold text-foreground mb-6'>{t('settings.themeTitle')}</h2>
						<div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
							{[
								{ id: 'violet' as const, name: t('themes.palettes.violet'), color: 'from-violet-500 to-purple-600' },
								{
									id: 'emerald' as const,
									name: t('themes.palettes.emerald'),
									color: 'from-emerald-500 to-green-600',
								},
								{ id: 'sunset' as const, name: t('themes.palettes.sunset'), color: 'from-orange-500 to-red-600' },
								{ id: 'ocean' as const, name: t('themes.palettes.ocean'), color: 'from-cyan-500 to-blue-600' },
							].map((themeOption) => {
								// التحقق من التحديد يعمل فقط بعد تفعيل mounted لمنع الوميض واختلاف الـ SSR
								const isActive = brandTheme === themeOption.id;

								return (
									<button
										key={themeOption.id}
										onClick={() => handleBrandThemeChange(themeOption.id)}
										className={`relative overflow-hidden rounded-xl border-2 p-6 text-center transition-all duration-300 hover:scale-105 ${
											isActive
												? 'border-brand-primary bg-linear-to-br from-brand-primary/20 to-brand-secondary/20 shadow-lg'
												: 'border-gray-700/50 bg-card-glass/50 hover:border-brand-primary/50'
										}`}
									>
										<div className={`absolute inset-0 bg-linear-to-br ${themeOption.color} opacity-10`} />
										<div className='relative'>
											<div
												className={`w-12 h-12 mx-auto mb-3 rounded-full bg-linear-to-br ${themeOption.color}`}
											/>
											<span className='font-medium text-foreground'>{themeOption.name}</span>
										</div>
									</button>
								);
							})}
						</div>

						{/* وضع العرض */}
						<h2 className='text-xl font-semibold text-foreground mb-6 mt-8'>{t('settings.displayMode')}</h2>
						<div className='grid grid-cols-3 sm:grid-cols-3 gap-4'>
							{[
								{ id: 'dark', value: 'dark', icon: '🌑', name: t('theme.modes.dark') },
								{ id: 'light', value: 'light', icon: '☀️', name: t('theme.modes.light') },
								{ id: 'system', value: 'system', icon: '💻', name: t('theme.modes.system') },
							].map((mode) => {
								// هنا نضمن تحديد الخيار الصحيح (داكن، فاتح، أو نظام) بشكل آمن تماماً
								const isActive = displayMode === mode.id;

								return (
									<button
										key={mode.id}
										onClick={() => handleDisplayModeChange(mode.value as 'dark' | 'light' | 'system')}
										className={`relative overflow-hidden rounded-xl border-2 p-6 text-center transition-all duration-300 hover:scale-105 ${
											isActive
												? 'border-brand-primary bg-linear-to-br from-brand-primary/20 to-brand-secondary/20 shadow-lg'
												: 'border-gray-700/50 bg-card-glass/50 hover:border-brand-primary/50'
										}`}
									>
										<div className='relative'>
											<span className='text-2xl mb-2 block'>{mode.icon}</span>
											<span className='font-medium text-foreground'>{mode.name}</span>
										</div>
									</button>
								);
							})}
						</div>
					</div>

					{/* اللغة */}
					<div className='backdrop-blur-xl bg-card-glass/80 rounded-2xl shadow-2xl border border-brand-primary/20 p-8'>
						<h2 className='text-xl font-semibold text-foreground mb-6'>Language / اللغة</h2>
						<div className='grid grid-cols-2 sm:grid-cols-2 gap-4'>
							{[
								{ id: 'en' as const, flag: '🇬🇧', label: 'English' },
								{ id: 'ar' as const, flag: '🇸🇦', label: 'العربية' },
							].map((langOption) => {
								const isActive = language === langOption.id;

								return (
									<button
										key={langOption.id}
										onClick={() => handleLanguageChange(langOption.id)}
										className={`relative overflow-hidden rounded-xl border-2 p-6 text-center transition-all duration-300 hover:scale-105 ${
											isActive
												? 'border-brand-primary bg-linear-to-br from-brand-primary/20 to-brand-secondary/20 shadow-lg'
												: 'border-gray-700/50 bg-card-glass/50 hover:border-brand-primary/50'
										}`}
									>
										<div className='relative'>
											<span className='text-2xl mb-2 block'>{langOption.flag}</span>
											<span className='font-medium text-foreground'>{langOption.label}</span>
										</div>
									</button>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
