import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'violet' | 'emerald' | 'sunset' | 'ocean';
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
			setTheme: (theme) => set({ theme }),
			setLanguage: (language) => set({ language }),
		}),
		{
			name: 'saraha-app-storage',
		}
	)
);
