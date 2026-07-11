import { APP_CONFIGS } from '@/shared/config/app-configs';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'violet' | 'emerald' | 'sunset' | 'ocean';
type Language = 'ar' | 'en';

interface AppState {
	theme: Theme;
	language: Language;
	setTheme: (theme: Theme) => void;
	setLanguage: (language: Language) => void;
}

export const useAppStore = create<AppState>()(
	persist(
		(set) => ({
			theme: 'violet',
			language: 'en',
			setTheme: (theme) => {
				set({ theme });
				if (typeof window !== 'undefined') {
					document.documentElement.setAttribute('data-theme', theme);
				}
			},
			setLanguage: (language) => set({ language }),
		}),
		{
			name: `${APP_CONFIGS.name}-app-storage`,
		},
	),
);
