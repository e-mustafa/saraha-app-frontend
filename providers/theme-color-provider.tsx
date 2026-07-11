// 'use client';

// import React, { createContext, useContext, useEffect, useState } from 'react';

// export type ThemeColor = 'violet' | 'emerald' | 'sunset' | 'ocean';

// interface ThemeColorContextType {
// 	themeColor: ThemeColor;
// 	setThemeColor: (color: ThemeColor) => void;
// }

// const ThemeColorContext = createContext<ThemeColorContextType | undefined>(undefined);

// export function ThemeColorProvider({ children }: { children: React.ReactNode }) {
// 	const [themeColor, setThemeColorState] = useState<ThemeColor>('violet');

// 	useEffect(() => {
// 		// جلب الثيم المحفوظ من الجلسة عند بدء التشغيل
// 		const savedColor = localStorage.getItem('theme-color') as ThemeColor;
// 		if (savedColor) {
// 			setThemeColorState(savedColor);
// 			document.documentElement.setAttribute('data-theme', savedColor);
// 		}
// 	}, []);

// 	const setThemeColor = (color: ThemeColor) => {
// 		setThemeColorState(color);
// 		localStorage.setItem('theme-color', color);
// 		document.documentElement.setAttribute('data-theme', color);
// 	};

// 	return <ThemeColorContext.Provider value={{ themeColor, setThemeColor }}>{children}</ThemeColorContext.Provider>;
// }

// export const useThemeColor = () => {
// 	const context = useContext(ThemeColorContext);
// 	if (!context) throw new Error('useThemeColor must be used within ThemeColorProvider');
// 	return context;
// };
