'use client';

import { useUser } from '@/modules/auth/hooks/use-auth';
import { ProfileForm } from '@/zzz/dashboard/profile-form';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
	const t = useTranslations('dashboard');
	const { data: user, isLoading, error } = useUser();

	return (
		<div className='min-h-full relative overflow-hidden'>
			{/* Animated background gradient */}
			<div className='absolute inset-0 bg-gradient-to-br from-brand-secondary/10 via-brand-primary/5 to-transparent animate-gradient-xy' />

			<div className='relative mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8'>
				<div className='mb-8'>
					<h1 className='text-4xl font-bold tracking-tight text-foreground mb-2'>{t('profile')}</h1>
					<p className='text-gray-500'>Manage your public link and profile settings</p>
				</div>

				{error && (
					<div className='backdrop-blur-lg bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500 mb-6'>
						Failed to load profile. Please try again later.
					</div>
				)}

				{isLoading ? (
					<div className='backdrop-blur-lg bg-card-glass/40 rounded-xl border border-brand-primary/20 p-8 shadow-lg animate-pulse'>
						<div className='h-8 bg-brand-primary/20 rounded w-1/3 mb-6' />
						<div className='space-y-4'>
							<div className='h-12 bg-brand-primary/20 rounded' />
							<div className='h-12 bg-brand-primary/20 rounded' />
							<div className='h-12 bg-brand-primary/20 rounded' />
							<div className='h-32 bg-brand-primary/20 rounded' />
						</div>
					</div>
				) : user ? (
					<div className='backdrop-blur-xl bg-card-glass/80 rounded-2xl shadow-2xl border border-brand-primary/20 p-8'>
						<ProfileForm user={user} />
					</div>
				) : null}
			</div>
		</div>
	);
}
