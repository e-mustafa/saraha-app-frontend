import { UserProfile } from '@/modules/profile/types/database';
import { defaultImages } from '@/shared/config/app-configs';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function UserSection({ user }: { user: Partial<UserProfile> }) {
	const t = useTranslations();
	console.log('UserMessages user', user);

	return (
		<div className='relative overflow-hidden rounded-3xl border border-white/10 dark:border-white/5 bg-card/40 backdrop-blur-xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center space-y-4 animate-in fade-in duration-500'>
			<div className='absolute -top-24 -left-20 w-72 h-72 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none' />

			<div className='relative w-28 h-28 rounded-2xl border-2 border-brand-primary/30 p-1 shadow-lg'>
				<Image
					src={user?.avatar || defaultImages.avatarMale}
					alt={user?.name || 'User avatar'}
					width={112}
					height={112}
					className='w-full h-full object-cover rounded-xl'
				/>
			</div>

			<div className='space-y-2'>
				<h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent'>
					{user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`}
				</h1>
				<p className='text-xs sm:text-sm text-muted-foreground max-w-md line-clamp-2'>
					{user?.bio || t('public.defaultBio') || 'أرسل لي نقدًا بناءً أو رسالة سرية دون أن أعرف هويتك!'}
				</p>
			</div>
		</div>
	);
}
