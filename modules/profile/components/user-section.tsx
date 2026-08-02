import { Link, useRouter } from '@/i18n/navigation';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import useBlockUser from '@/modules/profile/hooks/use-block-user';
import { UserProfile } from '@/modules/profile/types/database';
import { SmartTooltip } from '@/shared/components/custom-ui/smart-tooltip';
import { Button } from '@/shared/components/ui/button';
import { APP_ROUTES, defaultImages } from '@/shared/config/app-configs';
import { cn } from '@/shared/utils/utils';
import { BanIcon, CheckIcon, CopyIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import ShareButton from './share-button';

interface UserSectionProps {
	user: Partial<UserProfile>;
}

export default function UserSection({ user }: UserSectionProps) {
	const t = useTranslations();
	const router = useRouter();
	const [copied, setCopied] = useState<boolean>(false);

	const { user: authedUser, isAuthed, isLoading } = useAuth();
	const { mutate: blockUser, isPending: isBlocking } = useBlockUser(user._id || '');

	// Calculate whether the authed user has blocked the target user
	const isBlocked = Boolean(authedUser?.blockedUsers?.some((u) => u.id === user?.id || u.id === user?._id));

	// Determine if the current profile belongs to the logged-in user
	const isSelf = Boolean(!isLoading && isAuthed && authedUser && user?.username && authedUser.username === user.username);

	// Resolve proper avatar image with female/male fallback
	const avatarSrc = user?.avatar?.url || (user?.gender == 1 ? defaultImages.avatarFemale : defaultImages.avatarMale);

	const handleCopyUsername = async () => {
		if (!user?.username) return;

		try {
			const shareUrl = `${window.location.origin}${APP_ROUTES.visitor}/${user.username}`;
			await navigator.clipboard.writeText(shareUrl);
			setCopied(true);
			toast.success(t('profile.copiedSuccess'));
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy profile link:', err);
			toast.error(t('profile.copyFailed'));
		}
	};

	return (
		<div className='relative mt-24 rounded-3xl border bg-brand-primary/10 backdrop-blur-xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center space-y-4 animate-in fade-in duration-500'>
			{/* Decorative ambient background glows */}
			<div className='absolute -top-24 -left-20 w-72 h-72 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none' />
			<div className='absolute -bottom-24 -inset-e-20 w-72 h-72 bg-brand-secondary/10 rounded-full blur-[100px] pointer-events-none' />

			{/* Avatar container */}
			<div className='relative -mt-32 size-40 rounded-2xl border-2 border-brand-primary/30 p-1 shadow-lg group'>
				<Link
					href={user?.username ? `${APP_ROUTES.visitor}/${user.username}` : APP_ROUTES.profile}
					aria-label={user?.name || user?.firstName || 'User Profile'}
				>
					<Image
						src={avatarSrc}
						alt={user?.name || user?.firstName || 'User avatar'}
						width={112}
						height={112}
						className='w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105'
						priority
					/>
				</Link>
			</div>

			{/* User profile metadata */}
			<div className='space-y-1'>
				<h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight capitalize bg-linear-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent'>
					{user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
				</h1>

				{/* Username display & Action badge */}
				{isSelf ? (
					<div className='flex gap-4 items-center justify-center'>
						{user?.username && (
							<button
								type='button'
								onClick={handleCopyUsername}
								aria-label='Copy profile username link'
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
						)}

						{!user?.verified && (
							<Button
								type='button'
								variant='default'
								size='sm'
								onClick={() => router.push(APP_ROUTES.verifyAccount)}
								className='bg-yellow-700/50 hover:bg-yellow-500/40 text-yellow-400 transition-all shadow-md'
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

			{/* Footer action bar */}
			<div className='w-full flex gap-6 justify-between items-center'>
				<div className='flex gap-6 justify-start items-center'>
					{user?.visitCount && user.visitCount > 0 ? (
						<div className='p-2 border border-border bg-accent/70 rounded-lg text-sm text-muted-foreground'>
							{`${t('profile.visitors')}: ${user.visitCount}`}
						</div>
					) : null}

					
					<ShareButton username={user?.username || ''} />
				</div>

				{/* Block user trigger button (hidden on own profile) */}
				{/* {isAuthed && authedUser && !isSelf && ( */}
					<SmartTooltip>
						<Button
							type='button'
							className='bg-transparent hover:bg-transparent ms-auto'
							variant='destructive'
							size='icon'
							disabled={isBlocking}
							onClick={() => blockUser()}
							aria-label={isBlocked ? t('profile.blockedUsers.unblock') : t('profile.blockedUsers.block')}
							// title={isBlocked ? t('profile.blockedUsers.unblock') : t('profile.blockedUsers.block')}
						>
							<BanIcon
								className={cn(
									'size-4 transition-all',
									isBlocked ? 'text-red-500' : 'text-foreground',
									isBlocking && 'opacity-50 scale-95',
								)}
							/>
						</Button>
					</SmartTooltip>
				{/* )} */}
			</div>
		</div>
	);
}
