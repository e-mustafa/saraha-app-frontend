'use client';

import { useRouter } from '@/i18n/navigation';
import AvatarGlobal from '@/shared/components/avatar-global';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { useFormatDate } from '@/shared/hooks/use-format-date';
import { cn } from '@/shared/utils/utils';
import { useIsMutating } from '@tanstack/react-query';
import { FileMusicIcon, HeartIcon, LockIcon, LockKeyhole, Pause, Play, Trash2Icon, UnlockIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { MessageTypeEnum } from '../enums';
import useDeleteMessage from '../hooks/use-delete-message';
import useMarkMessageFavorite from '../hooks/use-mark-message-favorite';
import useMarkMessagePublic from '../hooks/use-mark-message-public';
import { Message, Person } from '../types/index';
import { TabType } from './user-messages';

// Check if the URL belongs to an audio file
const isAudioFile = (url: string) => {
	const cleanUrl = url.split('?')[0].toLowerCase();
	return ['.webm', '.mp3', '.wav', '.ogg', '.m4a', '.aac'].some((ext) => cleanUrl.endsWith(ext));
};

// Check if the URL belongs to a video file
const isVideoFile = (url: string) => {
	const cleanUrl = url.split('?')[0].toLowerCase();
	return ['.mp4', '.mov', '.webm', '.ogg'].some((ext) => cleanUrl.endsWith(ext) && !isAudioFile(url));
};

/* ==========================================================================
   SQUARE AUDIO PLAYER COMPONENT
   ========================================================================== */
const SquareAudioPlayer = ({ url }: { url: string }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState<number | null>(null);
	const [currentTime, setCurrentTime] = useState(0);

	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		const audio = new Audio(url);
		audioRef.current = audio;

		const handleLoadedMetadata = () => {
			setDuration(audio.duration);
		};

		const handleTimeUpdate = () => {
			setCurrentTime(audio.currentTime);
		};

		const handleEnded = () => {
			setIsPlaying(false);
			setCurrentTime(0);
		};

		audio.addEventListener('loadedmetadata', handleLoadedMetadata);
		audio.addEventListener('timeupdate', handleTimeUpdate);
		audio.addEventListener('ended', handleEnded);

		return () => {
			audio.pause();
			audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
			audio.removeEventListener('timeupdate', handleTimeUpdate);
			audio.removeEventListener('ended', handleEnded);
		};
	}, [url]);

	const togglePlay = () => {
		if (!audioRef.current) return;

		if (isPlaying) {
			audioRef.current.pause();
			setIsPlaying(false);
		} else {
			audioRef.current
				.play()
				.then(() => setIsPlaying(true))
				.catch((err) => console.error('Audio playback block:', err));
		}
	};

	const formatTime = (secs: number) => {
		const mins = Math.floor(secs / 60);
		const remainingSecs = Math.floor(secs % 60);
		return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
	};

	return (
		<div className='relative aspect-square rounded-xl overflow-hidden border border-brand-primary/20 bg-brand-primary/5 p-4 flex flex-col justify-between items-center shadow-sm animate-in zoom-in-95 duration-150 group'>
			{/* Animated/static music icon depending on status */}
			<FileMusicIcon
				className={cn(
					'size-6 text-brand-primary/60 transition-transform duration-300',
					isPlaying && 'scale-110 text-brand-primary animate-pulse',
				)}
			/>

			{/* Centered play/pause trigger */}
			<Button
				type='button'
				variant='ghost'
				size='icon'
				onClick={togglePlay}
				className='rounded-full size-12 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary flex items-center justify-center transition-all shadow-sm shrink-0'
			>
				{isPlaying ? (
					<Pause className='size-5 fill-brand-primary text-brand-primary' />
				) : (
					<Play className='size-5 fill-brand-primary text-brand-primary ml-0.5' />
				)}
			</Button>

			{/* Time duration tracker and micro bar */}
			<div className='w-full flex flex-col gap-1.5 mt-1'>
				<div className='relative w-full h-1 bg-muted/60 rounded-full overflow-hidden'>
					<div
						className='absolute top-0 left-0 h-full bg-brand-primary rounded-full transition-all duration-100'
						style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
					/>
				</div>
				<div className='flex justify-between items-center text-[10px] text-muted-foreground font-mono'>
					<span>{formatTime(currentTime)}</span>
					<span>{duration ? formatTime(duration) : '--:--'}</span>
				</div>
			</div>
		</div>
	);
};

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
export default function MessageCard({ message, tab, isAuthed }: { message: Message; tab: TabType; isAuthed: boolean }) {
	const t = useTranslations('messages');
	const router = useRouter();
	const formatDate = useFormatDate();

	const attachments = message.attachments || [];
	const hasAttachments = attachments.length > 0;

	const person = tab === MessageTypeEnum.SENT ? 'to' : 'from';
	const { id, avatar, name, username, isLive } = (message[person as keyof Message] as Person) || {};

	const { mutate: toggleFavorite } = useMarkMessageFavorite(message?.id);
	const { mutate: togglePublic } = useMarkMessagePublic(message?.id);
	const { mutate: deleteMessage } = useDeleteMessage(message?.id);

	const activeMutationsCount = useIsMutating({
		mutationKey: ['messages', message.id],
	});
	const isAnyActionPending = activeMutationsCount > 0;

	return (
		<Card className='overflow-hidden bg-card-blur rounded-xl border border-brand-primary/20 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-brand-primary/40 animate-in slide-in-from-bottom-4'>
			<CardContent className='px-0 space-y-5'>
				{/* Header: Sender info and controls */}
				<div className='flex flex-col sm:flex-row sm:items-center justify-between'>
					{id ? (
						<div className='flex items-center gap-2'>
							<Button
								variant='link'
								onClick={username ? () => router.push(`/u/${username}`) : undefined}
								className={cn(username && 'cursor-pointer')}
							>
								<AvatarGlobal
									src={avatar?.url || ''}
									alt={name || ''}
									name={name || ''}
									isLive={isLive}
									isAnonymous={message.isAnonymous}
								/>
							</Button>
							<div className='flex flex-col gap-2'>
								<div className='flex gap-2 items-center'>
									<div className='text-xs font-bold capitalize'>
										{message.isAnonymous ? t('anonymousSender') : name}
									</div>
									<div className='size-1.5 bg-muted rounded-full'></div>
									{message?.createdAt && (
										<span className='text-muted-foreground text-xs'>{formatDate(message?.createdAt, true)}</span>
									)}
								</div>
								{!message?.isPublic && (
									<div className='flex gap-1.5 items-center text-muted-foreground'>
										<LockKeyhole className='w-4 h-4' />
										<span className='text-xs'>{t('privateMessage')}</span>
									</div>
								)}
							</div>
						</div>
					) : (
						<div className='flex items-center gap-2'>
							<AvatarGlobal src='' alt='' name='' isLive={false} />
							<div className='text-xs font-bold text-muted-foreground tracking-wide'>{t('anonymousSender')}</div>
						</div>
					)}

					{isAuthed && (
						<div className='flex items-center justify-end gap-1.5 text-xs text-muted-foreground'>
							{/* Favorite Button */}
							<Button
								className='bg-transparent hover:bg-transparent'
								variant='ghost'
								size='icon'
								disabled={isAnyActionPending}
								onClick={() => toggleFavorite()}
							>
								<HeartIcon
									className={cn(
										'size-6 transition-all',
										message.fromFavorite || message.toFavorite ? 'text-red-500 fill-red-500' : 'fill-none',
										isAnyActionPending && 'opacity-50 scale-95',
									)}
								/>
							</Button>

							{/* Public/Private Switch */}
							<div className='flex items-center gap-2 border-x border-border/60 px-3'>
								<Label
									htmlFor={`confidential-switch-${message.id}`}
									className='text-xs text-muted-foreground cursor-pointer flex items-center gap-1'
								>
									{message.isPublic ? (
										<UnlockIcon className='w-3.5 h-3.5' />
									) : (
										<LockIcon className='w-3.5 h-3.5 text-amber-500' />
									)}
									{t('public')}
								</Label>
								<Switch
									id={`confidential-switch-${message.id}`}
									disabled={isAnyActionPending}
									checked={message.isPublic}
									onCheckedChange={() => togglePublic()}
								/>
							</div>

							{/* Delete Message Dialog */}
							<Dialog>
								<DialogTrigger asChild>
									<Button type='button' variant='destructive' size='icon' disabled={isAnyActionPending}>
										<Trash2Icon className={cn(isAnyActionPending && 'opacity-50 scale-95')} />
									</Button>
								</DialogTrigger>
								<DialogContent className='sm:max-w-sm bg-card-glass backdrop-blur-lg'>
									<DialogHeader>
										<DialogTitle>{t('deleteDialog.title')}</DialogTitle>
										<DialogDescription>{t('deleteDialog.description')}</DialogDescription>
									</DialogHeader>

									<DialogFooter className='py-2'>
										<DialogClose asChild>
											<Button variant='outline'>{t('deleteDialog.cancel')}</Button>
										</DialogClose>
										<Button
											type='submit'
											variant='destructive'
											disabled={isAnyActionPending}
											onClick={() => deleteMessage()}
										>
											{t('deleteDialog.confirm')}
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					)}
				</div>

				{/* Message Content Text */}
				<p className='mt-6 bg-brand-secondary/10 p-2 rounded-lg min-h-32 text-base font-normal leading-relaxed text-foreground/90 whitespace-pre-wrap wrap-break-word selection:bg-brand-primary/20'>
					{message.content}
				</p>

				{/* Unified Aspect-Square Attachments Grid (Audio & Images & Videos) */}
				{hasAttachments && (
					<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4'>
						{attachments.map((att, idx) => {
							const url = typeof att === 'string' ? att : att.url;
							const isAudio = isAudioFile(url);
							const isVideo = isVideoFile(url);

							if (isAudio) {
								return <SquareAudioPlayer key={idx} url={url} />;
							}

							return (
								<Dialog key={idx}>
									<DialogTrigger asChild>
										<div className='relative aspect-square rounded-xl overflow-hidden border border-border/80 group bg-muted/40 shadow-sm flex items-center justify-center cursor-pointer hover:opacity-95 transition-all duration-200 hover:border-brand-primary/40'>
											{isVideo ? (
												<video
													src={url}
													className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
													muted
													playsInline
													loop
													autoPlay
												/>
											) : (
												<img
													src={url}
													alt={`Attachment ${idx + 1}`}
													className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
												/>
											)}
											{/* Interactive zoom-in indicator overlay */}
											<div className='absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center' />
										</div>
									</DialogTrigger>
									<DialogContent className='max-w-3xl p-1 bg-transparent border-none shadow-none flex items-center justify-center backdrop-blur-md'>
										{isVideo ? (
											<video
												src={url}
												className='max-h-[85vh] max-w-full rounded-lg object-contain'
												controls
												autoPlay
											/>
										) : (
											<img
												src={url}
												alt={`Attachment ${idx + 1} expanded`}
												className='max-h-[85vh] max-w-full rounded-lg object-contain animate-in zoom-in-95'
											/>
										)}
									</DialogContent>
								</Dialog>
							);
						})}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
