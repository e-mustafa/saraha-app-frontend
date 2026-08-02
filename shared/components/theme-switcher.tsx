'use client';

import { Button } from '@/shared/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { cn } from '@/shared/utils/utils';
import { Theme, useAppStore } from '@/store/use-app-store';
import { Check, Laptop, Moon, Palette, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

export function ThemeSwitcher() {
	const t = useTranslations('themes');
	const { theme: mode, setTheme: setMode } = useTheme();
	const { theme: currentTheme, setTheme } = useAppStore();

	const colorOptions: { id: Theme; name: string; hex: string }[] = [
		{ id: 'violet', name: t('palettes.violet'), hex: '#7c3aed' },
		{ id: 'emerald', name: t('palettes.emerald'), hex: '#059669' },
		{ id: 'sunset', name: t('palettes.sunset'), hex: '#ea580c' },
		{ id: 'ocean', name: t('palettes.ocean'), hex: '#2563eb' },
	];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='icon' className='h-9 w-9 rounded-full text-brand-primary hover:text-foreground'>
					<Palette className='size-5' />
					<span className='sr-only'>{t('toggleTheme')}</span>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align='end' className='w-56 border-border/60 bg-card-glass backdrop-blur-md shadow-lg shadow-brand-secondary/30'>
				<DropdownMenuLabel className='text-xs font-medium text-muted-foreground/80'>
					{t('accentColor')}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{colorOptions.map((color) => (
					<DropdownMenuItem
						key={color.id}
						onClick={() => setTheme(color.id)}
						className='flex items-center justify-between cursor-pointer py-2 focus:bg-accent/60'
					>
						<div className='flex items-center gap-2.5'>
							<span
								className='h-3.5 w-3.5 rounded-full ring-1 ring-black/10 dark:ring-white/10 block'
								style={{ backgroundColor: color.hex }}
							/>
							<span
								className={cn(
									'text-sm transition-colors',
									currentTheme === color.id && 'font-semibold text-brand-primary',
								)}
							>
								{color.name}
							</span>
						</div>
						{currentTheme === color.id && <Check className='h-4 w-4 text-brand-primary' />}
					</DropdownMenuItem>
				))}

				<DropdownMenuSeparator />
				<DropdownMenuLabel className='text-xs font-medium text-muted-foreground/80'>
					{t('displayMode')}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				<DropdownMenuItem
					onClick={() => setMode('light')}
					className='flex items-center justify-between cursor-pointer py-2'
				>
					<div className='flex items-center gap-2.5'>
						<Sun className='h-4 w-4 text-amber-500' />
						<span className={cn('text-sm', mode === 'light' && 'font-semibold')}>{t('modes.light')}</span>
					</div>
					{mode === 'light' && <Check className='h-4 w-4' />}
				</DropdownMenuItem>

				<DropdownMenuItem
					onClick={() => setMode('dark')}
					className='flex items-center justify-between cursor-pointer py-2'
				>
					<div className='flex items-center gap-2.5'>
						<Moon className='h-4 w-4 text-sky-400' />
						<span className={cn('text-sm', mode === 'dark' && 'font-semibold')}>{t('modes.dark')}</span>
					</div>
					{mode === 'dark' && <Check className='h-4 w-4' />}
				</DropdownMenuItem>

				<DropdownMenuItem
					onClick={() => setMode('system')}
					className='flex items-center justify-between cursor-pointer py-2'
				>
					<div className='flex items-center gap-2.5'>
						<Laptop className='h-4 w-4 text-neutral-400' />
						<span className={cn('text-sm', mode === 'system' && 'font-semibold')}>{t('modes.system')}</span>
					</div>
					{mode === 'system' && <Check className='h-4 w-4' />}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
