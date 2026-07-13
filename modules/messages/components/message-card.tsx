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
import { useFormatDate } from '@/shared/hooks/use-format-date';
import { cn } from '@/shared/utils/utils';
import { HeartIcon, LockKeyhole, Trash2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MessageTypeEnum } from '../enums';
import useDeleteMessage from '../hooks/use-delete-message';
import useMarkMessageFavorite from '../hooks/use-mark-message-favorite';
import { Message, Person } from '../types/index';
import MediaGrid from './message-media-grid';
import { TabType } from './user-messages';

export default function MessageCard({ message, tab, isAuthed }: { message: Message; tab: TabType; isAuthed: boolean }) {
	const t = useTranslations('messages');
	const router = useRouter();
	const formatDate = useFormatDate();
	const hasMedia = message.attachments && message.attachments.length > 0;
	// const person = tab === 'inbox' ? 'from' : tab === 'sent' ? 'to' : 'from';
	const person = tab === MessageTypeEnum.SENT ? 'to' : 'from';
	const { id, avatar, name, username, isLive } = (message[person as keyof Message] as Person) || {};

	const { mutate, isPending } = useMarkMessageFavorite();
	const { mutate: deleteMessage, isPending: isDeleting } = useDeleteMessage();

	return (
		<Card className='overflow-hidden backdrop-blur-lgxxx bg-card-glass/60xx bg-card-blur rounded-xl border border-brand-primary/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-brand-primary/40 animate-in slide-in-from-bottom-4'>
			<CardContent className='px-0 space-y-5'>
				{/* البنية العلوية للكارد: الأيقونة والتاريخ */}
				<div className='flex items-center justify-between'>
					{/* <div className='flex items-center gap-2.5'>
						<div className='w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary'>
							<MessageSquareIcon className='w-4 h-4' />
						</div>
						<span className='text-xs font-bold text-muted-foreground tracking-wide'>
							{tab === MessageTypeEnum.INBOX ? 'رسالة مجهولة' : tab === 'sent' ? 'رسالة صادرة' : 'رسالة مميزة'}
						</span>
					</div> */}
					{id ? (
						<div className='flex items-center gap-2'>
							<Button
								variant='link'
								onClick={username ? () => router.push(`/u/${username}`) : undefined}
								className={cn(username && 'cursor-pointer')}
							>
								<AvatarGlobal
									src={avatar}
									alt={name}
									name={name}
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
								{/* <div className='text-xs font-bold text-muted-foreground tracking-wide'>@{username}</div> */}
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
						<div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
							<Button
								className='bg-transparent! hover:bg-transparent!'
								variant='ghost'
								size='icon-lg'
								disabled={isPending || isDeleting}
								onClick={() => mutate(message.id)}
							>
								<HeartIcon
									className={cn(
										'size-6',
										message.fromFavorite || message.toFavorite ? 'text-red-500 fill-red-500' : 'fill-non',
										isPending && 'opacity-50 animate-pulse scale-110',
									)}
								/>
							</Button>
							<Dialog>
								<DialogTrigger asChild>
									<Button
										type='button'
										// className='bg-transparent! hover:bg-transparent!'
										variant='destructive'
										size='icon'
										disabled={isDeleting || isPending}
									>
										<Trash2Icon
											className={cn(
												// 'size-4',
												isDeleting && 'opacity-50 animate-pulse scale-110',
											)}
										/>
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
										<Button type='submit' variant='destructive' onClick={() => deleteMessage(message.id)}>
											{t('deleteDialog.confirm')}
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>

							<span>
								{/* {new Date(message.createdAt).toLocaleDateString('ar-EG', {
									day: 'numeric',
									month: 'short', 
									year: 'numeric',
								})} */}

								{/* {formatDate(message.createdAt, true)} */}
							</span>
						</div>
					)}
				</div>

				<p className='mt-6 bg-brand-secondary/10 p-2 rounded-lg min-h-32 text-base font-normal leading-relaxed text-foreground/90 whitespace-pre-wrap wrap-break-word selection:bg-brand-primary/20'>
					{message.content}
				</p>

				{hasMedia && (
					<div className='mt-3'>
						<MediaGrid media={message.attachments!} />
					</div>
				)}
			</CardContent>
		</Card>
	);
}
