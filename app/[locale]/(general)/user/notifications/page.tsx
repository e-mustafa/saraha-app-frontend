'use client';

import { useTranslations } from 'next-intl';

interface Notification {
	id: string;
	type: 'message' | 'profile' | 'system';
	title: string;
	message: string;
	createdAt: string;
	read: boolean;
}

export default function NotificationsPage() {
	const t = useTranslations('dashboard');

	// Mock notifications data
	const notifications: Notification[] = [
		{
			id: '1',
			type: 'message',
			title: 'New Message Received',
			message: 'You received a new anonymous message from @user123',
			createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
			read: false,
		},
		{
			id: '2',
			type: 'profile',
			title: 'Profile Updated',
			message: 'Your profile has been successfully updated',
			createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
			read: true,
		},
		{
			id: '3',
			type: 'system',
			title: 'Welcome to Saraha',
			message: 'Thank you for joining our anonymous messaging platform',
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
			read: true,
		},
	];

	const getNotificationIcon = (type: Notification['type']) => {
		switch (type) {
			case 'message':
				return '💬';
			case 'profile':
				return '👤';
			case 'system':
				return '🔔';
			default:
				return '📌';
		}
	};

	const getNotificationColor = (type: Notification['type']) => {
		switch (type) {
			case 'message':
				return 'from-brand-primary to-brand-secondary';
			case 'profile':
				return 'from-emerald-500 to-green-600';
			case 'system':
				return 'from-orange-500 to-red-600';
			default:
				return 'from-gray-500 to-gray-600';
		}
	};

	return (
		<div className='min-h-full relative overflow-hidden'>
			{/* Animated background gradient */}
			<div className='absolute inset-0 bg-gradient-to-br from-brand-secondary/10 via-brand-primary/5 to-transparent animate-gradient-xy' />

			<div className='relative mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8'>
				<div className='mb-8'>
					<h1 className='text-4xl font-bold tracking-tight text-foreground mb-2'>{t('notifications')}</h1>
					<p className='text-gray-500'>Stay updated with your latest notifications</p>
				</div>

				<div className='space-y-4'>
					{notifications.length === 0 ? (
						<div className='backdrop-blur-xl bg-card-glass/80 rounded-2xl shadow-2xl border border-brand-primary/20 p-12 text-center'>
							<p className='text-gray-500 text-lg'>No notifications yet</p>
						</div>
					) : (
						notifications.map((notification) => (
							<div
								key={notification.id}
								className={`backdrop-blur-xl bg-card-glass/80 rounded-2xl shadow-2xl border border-brand-primary/20 p-6 transition-all duration-300 hover:shadow-xl ${
									!notification.read ? 'border-l-4 border-l-brand-primary' : ''
								}`}
							>
								<div className='flex items-start gap-4'>
									<div
										className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${getNotificationColor(notification.type)} flex items-center justify-center text-2xl`}
									>
										{getNotificationIcon(notification.type)}
									</div>
									<div className='flex-1'>
										<div className='flex items-center justify-between mb-2'>
											<h3 className='font-semibold text-foreground'>{notification.title}</h3>
											<span className='text-sm text-gray-500'>
												{new Date(notification.createdAt).toLocaleDateString()}
											</span>
										</div>
										<p className='text-gray-600'>{notification.message}</p>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
