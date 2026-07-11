'use client';

import { useMessages } from '@/hooks/use-messages';
import { MessagesGrid } from '@/zzz/dashboard/messages-grid';
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
	const t = useTranslations('dashboard');
	const { data: messages, isLoading, error } = useMessages();

	return (
		<div className='min-h-full relative overflow-hidden'>
			{/* Animated background gradient */}
			<div className='absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-brand-secondary/5 to-transparent animate-gradient-xy' />

			<div className='relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
				<div className='mb-8'>
					<h1 className='text-4xl font-bold tracking-tight text-foreground mb-2'>{t('messages')}</h1>
					<p className='text-gray-500'>View and manage your anonymous messages</p>
				</div>

				{error && (
					<div className='backdrop-blur-lg bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500'>
						Failed to load messages. Please try again later.
					</div>
				)}

				<MessagesGrid messages={messages || []} loading={isLoading} />
			</div>
		</div>
	);
}
