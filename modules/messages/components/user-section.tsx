import { Link, useRouter } from '@/i18n/navigation';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { UserProfile } from '@/modules/profile/types/database';
import { Button } from '@/shared/components/ui/button';
import { APP_ROUTES, defaultImages } from '@/shared/config/app-configs';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import ShareButton from './share-button';

export default function UserSection({ user }: { user: Partial<UserProfile> }) {
	const t = useTranslations();
	const router = useRouter();
	const [copied, setCopied] = useState(false);

	const { user: authedUser, isAuthed } = useAuth();

	const handleCopyUsername = async () => {
		try {
			const shareUrl = `${window.location.origin}${APP_ROUTES.visitor}/${user?.username}`;
			// const shareUrl = profileLink;
			await navigator.clipboard.writeText(shareUrl);
			setCopied(true);
			toast.success(t('profile.copiedSuccess'));
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.log('failed copy link:', err);
			toast.error(t('profile.copyFailed'));
		}
	};
	return (
		<div className='relative mt-24 rounded-3xl border bg-brand-primary/10 backdrop-blur-xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center space-y-4 animate-in fade-in duration-500'>
			{/* خلفية ضوئية جمالية خلف الحساب */}
			<div className='absolute -top-24 -left-20 w-72 h-72 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none' />
			<div className='absolute -bottom-24 -inset-e-20 w-72 h-72 bg-brand-secondary/10 rounded-full blur-[100px] pointer-events-none' />

			{/* الصورة الشخصية بحواف عصرية ووهج خفيف */}

			<div className='relative -mt-32 size-40 rounded-2xl border-2 border-brand-primary/30 p-1 shadow-lg group'>
				<Link href={isAuthed ? APP_ROUTES.profile : ''}>
					<Image
						src={user?.avatar?.url || defaultImages.avatarMale || ''}
						alt={user?.name || user?.firstName || 'user avatar'}
						width={112}
						height={112}
						className='w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105'
					/>
				</Link>
			</div>

			{/* اسم المستخدم والمعلومات الشخصية */}
			<div className='space-y-1'>
				<h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight capitalize bg-linear-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent'>
					{user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`}
				</h1>
				{/* شارة اسم المستخدم التفاعلية القابلة للنسخ */}
				{isAuthed && authedUser && authedUser?.username === user?.username ? (
					<div className='flex gap-4 items-center justify-center'>
						<button
							type='button'
							onClick={handleCopyUsername}
							className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-secondary/60 hover:bg-secondary border border-border/60 transition-all duration-200 cursor-pointer active:scale-95 group'
						>
							<span className='text-muted-foreground group-hover:text-brand-primary transition-colors'>
								@{user?.username}
							</span>
							{copied ? (
								<CheckIcon className='w-3.5 h-3.5 text-emerald-500 animate-in zoom-in' />
							) : (
								<CopyIcon className='w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors' />
							)}
						</button>

						{!user?.verified && (
							<Button
								type='button'
								variant='default'
								size='sm'
								onClick={() => router.push(APP_ROUTES.verifyAccount)}
								className=' bg-yellow-700/50 hover:bg-yellow-500/40 text-yellow-400 transition-all shadow-md'
							>
								{t('auth.steps.activeAccount')}
							</Button>
						)}
					</div>
				) : (
					<p className='text-sm text-muted-foreground'>@{user?.username}</p>
				)}
				<p className='text-sm text-muted-foreground'>{user?.bio || t('public.defaultBio')}</p>
			</div>

			<div className='w-full flex gap-6 justify-start items-center'>
				{user?.visitCount && user?.visitCount > 0 ? (
					<div className='p-2 border border-border bg-accent/70 rounded-lg text-sm text-muted-foreground'>
						{`${t('profile.visitors')}: ${user?.visitCount || 0}`}
					</div>
				) : null}

				<ShareButton username={user?.username || ''} />
			</div>
		</div>
	);
}
