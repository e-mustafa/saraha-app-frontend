'use client';

import { useRouter } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { ArrowLeft, CompassIcon, HomeIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function NotFoundPage() {
	const t = useTranslations();
	const router = useRouter();

	return (
		<div className='relative min-h-[100dvh] w-full flex items-center justify-center px-6 overflow-hidden pb-12 selection:bg-brand-primary/20'>
			{/* Aesthetic background radial gradient blur effects matching the design tokens */}
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[500px] h-[500px] bg-radial from-brand-primary/15 via-transparent to-transparent opacity-60 blur-3xl' />
			<div className='absolute bottom-0 left-10 -z-10 w-72 h-72 bg-brand-secondary/10 rounded-full blur-[100px] pointer-events-none' />

			{/* Main glassmorphic container */}
			<div className='relative w-full max-w-xl overflow-hidden rounded-3xl border border-border/40 dark:border-border/20 bg-card-blur backdrop-blur-2xl p-8 sm:p-12 shadow-2xl flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-500'>
				{/* Visual Header: Giant 404 typography with underlying glass badge */}
				<div className='relative flex flex-col items-center justify-center select-none'>
					<span className='text-8xl sm:text-9xl font-black tracking-tighter bg-linear-to-b from-brand-primary via-brand-primary/80 to-transparent bg-clip-text text-transparent leading-none opacity-90 drop-shadow-sm'>
						404
					</span>

					{/* Floating Icon Badge overlaying the typography */}
					<div className='absolute -bottom-4 size-14 rounded-2xl bg-card border border-border/60 dark:border-border/30 shadow-xl flex items-center justify-center text-brand-primary transform -rotate-6 hover:rotate-0 transition-transform duration-300 group cursor-pointer'>
						<CompassIcon className='size-7 animate-spin [animation-duration:10s]' />
					</div>
				</div>

				{/* Error Message Context */}
				<div className='space-y-3 max-w-md pt-2'>
					<h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight bg-linear-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent'>
						{t('notFoundPage.title') || 'يبدو أنك ضللت الطريق!'}
					</h1>
					<p className='text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm mx-auto'>
						{t('notFoundPage.description') || 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مسار آخر.'}
					</p>
				</div>

				{/* Divider line using theme borders */}
				<div className='w-24 h-px bg-linear-to-r from-transparent via-border/60 to-transparent' />

				{/* Call To Action (CTA) Buttons */}
				<div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center items-center'>
					{/* Primary Button: Direct routing to home layout */}
					<Button
						variant='default'
						size='lg'
						onClick={() => router.push(APP_ROUTES.home || '/')}
						className='w-full sm:w-auto h-11 rounded-xl gap-2 font-bold px-6 bg-brand-primary hover:bg-brand-primary/90 text-white shadow-lg shadow-brand-primary/15 active:scale-95 transition-all'
					>
						<HomeIcon className='size-4.5' />
						{t('auth.navigation.backHome') || 'العودة للرئيسية'}
					</Button>

					{/* Secondary Button: Support or Contact routing if applicable */}
					<Button
						variant='outline'
						size='lg'
						onClick={() => router.back()}
						className='w-full sm:w-auto h-11 rounded-xl gap-2 font-semibold px-6 border-border/60 hover:bg-accent/40 active:scale-95 transition-all text-muted-foreground hover:text-foreground'
					>
						{/* <HelpCircleIcon className='size-4.5 text-brand-primary/80' /> */}
						<ArrowLeft className='size-4.5 text-brand-primary/80 rtl:rotate-180' />
						{t('auth.navigation.backHome')}
					</Button>
				</div>
			</div>
		</div>
	);
}
