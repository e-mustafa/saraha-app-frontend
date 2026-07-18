'use client';

import { useRouter } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { HomeIcon, UserPlusIcon, UserXIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PublicProfileNotFound() {
	const t = useTranslations();
	const router = useRouter();

	return (
		<div className='w-full max-w-2xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]'>
			{/* High-tech glassmorphic error container */}
			<div className='relative w-full overflow-hidden rounded-3xl border border-destructive/20 dark:border-destructive/10 bg-card-blur backdrop-blur-2xl p-8 sm:p-12 shadow-2xl flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-400'>
				{/* Background styling blur effects */}
				<div className='absolute -top-12 -left-12 w-48 h-48 bg-destructive/10 rounded-full blur-[80px] pointer-events-none' />
				<div className='absolute -bottom-12 -right-12 w-48 h-48 bg-brand-primary/10 rounded-full blur-[80px] pointer-events-none' />

				{/* Dynamic Error Icon Badge */}
				<div className='relative size-24 rounded-2xl bg-destructive/10 border border-destructive/30 flex items-center justify-center text-destructive shadow-inner group'>
					<UserXIcon className='size-12 transition-transform duration-300 group-hover:scale-110' />
					<div className='absolute inset-0 rounded-2xl bg-destructive/5 animate-ping opacity-30 pointer-events-none' />
				</div>

				{/* Error Context Messaging */}
				<div className='space-y-2 max-w-md'>
					<h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight bg-linear-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent'>
						{t('public.notFoundTitle') || 'الحساب غير موجود'}
					</h1>
					<p className='text-sm text-muted-foreground leading-relaxed'>
						{t('public.notFoundDescription') ||
							'عذراً، الرابط الذي تحاول زيارته غير صحيح أو قد يكون صاحب الحساب قام بتغيير اسم المستخدم الخاص به.'}
					</p>
				</div>

				{/* Action Buttons to redirect users */}
				<div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-4 selection:bg-brand-primary/20'>
					<Button
						variant='default'
						size='lg'
						onClick={() => router.push(APP_ROUTES.home || '/')}
						className='rounded-xl gap-2 font-semibold px-6 shadow-md shadow-brand-primary/10 active:scale-95 transition-all'
					>
						<HomeIcon className='size-4' />
						{t('auth.navigation.backHome')}
					</Button>

					<Button
						variant='secondary'
						size='lg'
						onClick={() => router.push(APP_ROUTES.register || '/auth/register')}
						className='rounded-xl gap-2 font-semibold px-6 border border-border/50 active:scale-95 transition-all'
					>
						<UserPlusIcon className='size-4 text-brand-primary' />
						{t('public.createNewAccount') || 'أنشئ حسابك الخاص'}
					</Button>
				</div>
			</div>
		</div>
	);
}
