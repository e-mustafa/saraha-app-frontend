'use client';

import { useAppStore } from '@/store/use-app-store';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
	const t = useTranslations('dashboard');
	const { theme, setTheme } = useAppStore();
	const { setTheme: setNextTheme } = useTheme();
	const { language, setLanguage } = useAppStore();

	const handleThemeChange = (newTheme: 'violet' | 'emerald' | 'sunset' | 'ocean') => {
		setTheme(newTheme);
		setNextTheme(newTheme);
	};

	const handleLanguageChange = (newLanguage: 'ar' | 'en') => {
		setLanguage(newLanguage);
		// TODO: Implement locale redirect
	};

	return (
		<div className='min-h-full'>
			<div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
				<h1 className='text-3xl font-bold tracking-tight text-foreground'>{t('settings')}</h1>

				<div className='mt-8 space-y-6'>
					<div>
						<h2 className='text-xl font-semibold text-foreground'>{t('theme')}</h2>
						<div className='mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4'>
							{[
								{ id: 'violet', name: t('theme.violet') },
								{ id: 'emerald', name: t('theme.emerald') },
								{ id: 'sunset', name: t('theme.sunset') },
								{ id: 'ocean', name: t('theme.ocean') },
							].map((themeOption) => (
								<button
									key={themeOption.id}
									onClick={() => handleThemeChange(themeOption.id as 'violet' | 'emerald' | 'sunset' | 'ocean')}
									className={`rounded-lg border-2 p-4 text-center transition-colors ${
										theme === themeOption.id
											? 'border-brand-primary bg-brand-primary/10'
											: 'border-gray-700 hover:border-brand-primary/50'
									}`}
								>
									{themeOption.name}
								</button>
							))}
						</div>
					</div>

					<div>
						<h2 className='text-xl font-semibold text-foreground'>Language / اللغة</h2>
						<div className='mt-4 flex gap-4'>
							<button
								onClick={() => handleLanguageChange('en')}
								className={`rounded-lg border-2 px-6 py-3 transition-colors ${
									language === 'en'
										? 'border-brand-primary bg-brand-primary/10'
										: 'border-gray-700 hover:border-brand-primary/50'
								}`}
							>
								English
							</button>
							<button
								onClick={() => handleLanguageChange('ar')}
								className={`rounded-lg border-2 px-6 py-3 transition-colors ${
									language === 'ar'
										? 'border-brand-primary bg-brand-primary/10'
										: 'border-gray-700 hover:border-brand-primary/50'
								}`}
							>
								العربية
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
