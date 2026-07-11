'use client';

import { useAppStore } from '@/store/use-app-store';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SettingsPage() {
	const t = useTranslations('settings');
	const { theme, setTheme } = useAppStore();
	const { setTheme: setNextTheme } = useTheme();
	const { language, setLanguage } = useAppStore();
	const router = useRouter();
	const pathname = usePathname();

	const handleThemeChange = (newTheme: 'violet' | 'emerald' | 'sunset' | 'ocean') => {
		setTheme(newTheme);
		// setNextTheme(newTheme);
		setNextTheme('newTheme');
		toast.success(`Theme changed to ${newTheme}`);
	};

	const handleLanguageChange = (newLanguage: 'ar' | 'en') => {
		setLanguage(newLanguage);
		// Navigate to the new locale
		const currentPath = pathname.replace(/^\/(ar|en)/, '');
		router.push(`/${newLanguage}${currentPath}`);
		toast.success(`Language changed to ${newLanguage === 'ar' ? 'العربية' : 'English'}`);
	};

	return (
		<div className='min-h-full relative overflow-hidden'>
			{/* Animated background gradient */}
			<div className='absolute inset-0 bg-linear-to-br from-brand-primary/10 via-brand-secondary/5 to-transparent animate-gradient-xy' />

			<div className='relative mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8'>
				<div className='mb-8'>
					<h1 className='text-4xl font-bold tracking-tight text-foreground mb-2'>{t('settings')}</h1>
					<p className='text-gray-500'>Customize your app experience</p>
				</div>

				<div className='space-y-8'>
					{/* Theme Selection */}
					<div className='backdrop-blur-xl bg-card-glass/80 rounded-2xl shadow-2xl border border-brand-primary/20 p-8'>
						<h2 className='text-xl font-semibold text-foreground mb-6'>{t('theme.themeTitle')}</h2>
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
							{[
								{ id: 'violet' as const, name: t('theme.colors.violet'), color: 'from-violet-500 to-purple-600' },
								{ id: 'emerald' as const, name: t('theme.colors.emerald'), color: 'from-emerald-500 to-green-600' },
								{ id: 'sunset' as const, name: t('theme.colors.sunset'), color: 'from-orange-500 to-red-600' },
								{ id: 'ocean' as const, name: t('theme.colors.ocean'), color: 'from-cyan-500 to-blue-600' },
							].map((themeOption) => (
								<button
									key={themeOption.id}
									onClick={() => handleThemeChange(themeOption.id)}
									className={`relative overflow-hidden rounded-xl border-2 p-6 text-center transition-all duration-300 hover:scale-105 ${
										theme === themeOption.id
											? 'border-brand-primary bg-linear-to-br from-brand-primary/20 to-brand-secondary/20 shadow-lg'
											: 'border-gray-700/50 bg-card-glass/50 hover:border-brand-primary/50'
									}`}
								>
									<div className={`absolute inset-0 bg-linear-to-br ${themeOption.color} opacity-10`} />
									<div className='relative'>
										<div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-linear-to-br ${themeOption.color}`} />
										<span className='font-medium text-foreground'>{themeOption.name}</span>
									</div>
								</button>
							))}
						</div>

						<h2 className='text-xl font-semibold text-foreground mb-6 mt-8'>{t('theme.displayMode')}</h2>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<button
								onClick={() => handleLanguageChange('en')}
								className={`relative overflow-hidden rounded-xl border-2 p-6 text-center transition-all duration-300 hover:scale-105 ${
									language === 'en'
										? 'border-brand-primary bg-linear-to-br from-brand-primary/20 to-brand-secondary/20 shadow-lg'
										: 'border-gray-700/50 bg-card-glass/50 hover:border-brand-primary/50'
								}`}
							>
								<div className='relative'>
									<span className='text-2xl mb-2 block'>🇬🇧</span>
									<span className='font-medium text-foreground'>{t('theme.modes.dark')}</span>
								</div>
							</button>
							<button
								onClick={() => handleLanguageChange('ar')}
								className={`relative overflow-hidden rounded-xl border-2 p-6 text-center transition-all duration-300 hover:scale-105 ${
									language === 'ar'
										? 'border-brand-primary bg-linear-to-br from-brand-primary/20 to-brand-secondary/20 shadow-lg'
										: 'border-gray-700/50 bg-card-glass/50 hover:border-brand-primary/50'
								}`}
							>
								<div className='relative'>
									<span className='text-2xl mb-2 block'>🇸🇦</span>
									<span className='font-medium text-foreground'>{t('theme.modes.light')}</span>
								</div>
							</button>
						</div>
					</div>

					{/* Language Selection */}
					<div className='backdrop-blur-xl bg-card-glass/80 rounded-2xl shadow-2xl border border-brand-primary/20 p-8'>
						<h2 className='text-xl font-semibold text-foreground mb-6'>Language / اللغة</h2>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<button
								onClick={() => handleLanguageChange('en')}
								className={`relative overflow-hidden rounded-xl border-2 p-6 text-center transition-all duration-300 hover:scale-105 ${
									language === 'en'
										? 'border-brand-primary bg-linear-to-br from-brand-primary/20 to-brand-secondary/20 shadow-lg'
										: 'border-gray-700/50 bg-card-glass/50 hover:border-brand-primary/50'
								}`}
							>
								<div className='relative'>
									<span className='text-2xl mb-2 block'>🇬🇧</span>
									<span className='font-medium text-foreground'>English</span>
								</div>
							</button>
							<button
								onClick={() => handleLanguageChange('ar')}
								className={`relative overflow-hidden rounded-xl border-2 p-6 text-center transition-all duration-300 hover:scale-105 ${
									language === 'ar'
										? 'border-brand-primary bg-linear-to-br from-brand-primary/20 to-brand-secondary/20 shadow-lg'
										: 'border-gray-700/50 bg-card-glass/50 hover:border-brand-primary/50'
								}`}
							>
								<div className='relative'>
									<span className='text-2xl mb-2 block'>🇸🇦</span>
									<span className='font-medium text-foreground'>العربية</span>
								</div>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
