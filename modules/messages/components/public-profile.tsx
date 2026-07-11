'use client';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import { usePublicProfile } from '@/modules/profile/hooks/use-public';
import EmojiPicker from '@/shared/components/emoji-picker';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Textarea } from '@/shared/components/ui/textarea';
import { appConfig } from '@/shared/config/app-configs';
import { IResponse } from '@/shared/types/index';
import { apiClient } from '@/shared/utils/apiClient';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
	Loader2Icon,
	LockIcon,
	MessageSquareIcon,
	PaperclipIcon,
	SendIcon,
	SmileIcon,
	UnlockIcon,
	UploadCloudIcon,
	XIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { startTransition, useRef, useState } from 'react';
import { toast } from 'sonner';
import { MessageTypeEnum } from '../enums';
import { Message } from '../types/index'; // Adjust path according to your structure
import EmptyMessages from './empty-messages';
import MessageCard from './message-card';
import MessageSkeletonCard from './message-skeleton-card';
import MessagesPagination from './messages-pagination';
import PublicProfileNotFound from './public-profile-not-found';
import PublicProfileSkeleton from './public-profile-skeleton';
import UserSection from './user-section';

interface PublicProfileProps {
	username: string;
}

export default function PublicProfile({ username }: PublicProfileProps) {
	const t = useTranslations();
	const fileInputRef = useRef<HTMLInputElement>(null);
	console.log('username', username);

	// Form states
	const [messageText, setMessageText] = useState('');
	const [attachments, setAttachments] = useState<File[]>([]);
	const [isPublic, setIsPublic] = useState(false);
	const [isAnonymous, setIsAnonymous] = useState(true);
	const [isDragActive, setIsDragActive] = useState(false);

	const [currentPage, setCurrentPage] = useState<number>(1);

	const { user, isLoading: isAuthLoading } = useAuth();
	const { data: targetUser } = usePublicProfile(username || '');

	// Fetch public messages for this user
	const { data, isLoading } = useQuery({
		queryKey: ['public-messages', username],
		queryFn: async () => {
			const response = await apiClient.get<IResponse<Message[]>>(
				`/messages/public/${username}?page=${currentPage}&limit=10`,
			);
			return response;
		},
		enabled: !!username,
	});

	const { data: messages, metadata } = data || {};

	// Send message mutation handling FormData for media attachments
	const { mutate: sendMessage, isPending } = useMutation({
		mutationFn: async () => {
			const formData = new FormData();
			formData.append('content', messageText);
			formData.append('isPublic', String(isPublic));
			formData.append('isAnonymous', String(isAnonymous));

			if (attachments?.length) {
				attachments.forEach((file) => {
					formData.append('attachments', file);
				});
			}

			return await apiClient.post<IResponse<null>>(`/messages/public/${username}`, formData, {
				// headers: { 'Content-Type': 'multipart/form-data' },
			});
		},
		onSuccess: () => {
			// toast.success(res.message || t('messages.send.success'));
			setMessageText('');
			setAttachments([]);
			setIsPublic(false);
		},
		// onError: (error: unknown) => {
		// 	toast.error((error as { message?: string })?.message || t('messages.errors.messageSent'));
		// },
	});

	const [selectedEmoji, setSelectedEmoji] = useState<string>('');

	const handleEmojiSelect = (emoji: string) => {
		setSelectedEmoji(emoji);
		setMessageText((prev) => prev + emoji);
	};

	// Handle file drop & selections
	const handleFiles = (filesList: FileList) => {
		const validFiles = Array.from(filesList).filter(
			(file) => file.type.startsWith('image/') || file.type.startsWith('video/'),
		);

		if (attachments.length + validFiles.length > 4) {
			toast.warning(t('messages.errors.maxFilesWarning'));
			return;
		}

		setAttachments((prev) => [...prev, ...validFiles]);
	};

	const onDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragActive(true);
	};

	const onDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragActive(false);
	};

	const onDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			handleFiles(e.dataTransfer.files);
		}
	};

	const removeAttachment = (index: number) => {
		setAttachments((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!messageText.trim() && attachments.length === 0) {
			toast.error(t('messages.errors.emptyMessage'));
			return;
		}
		startTransition(() => {
			sendMessage();
		});
	};

	if (isLoading || isAuthLoading) {
		return <PublicProfileSkeleton />;
	}

	// 2. Handle Non-Existing Target User (API returned 404 / null)
	if (!targetUser) {
		return <PublicProfileNotFound />;
	}

	return (
		<div className='w-full max-w-3xl mx-auto px-4 py-8 space-y-8 overflow-hidden'>
			{/* ================= SECTION 1: TARGET USER IDENTITY CARD ================= */}
			<UserSection user={targetUser || {}} />

			{/* ================= SECTION 2: SMART CONCEALED MESSAGING BOX ================= */}
			<Card
				className={`overflow-hidden bg-card-blur rounded-3xl border transition-all duration-300 shadow-xl ${
					isDragActive ? 'border-brand-primary bg-brand-primary/5 scale-[1.01]' : 'border-white/10 dark:border-white/5'
				}`}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
			>
				<CardContent className='sm:px-6  space-y-4 relative'>
					<form onSubmit={handleSubmit} className='space-y-4'>
						{/* Advanced Header Controls within Form */}
						<div className='flex flex-col sm:flex-row gap-4 items-start justify-between border-b border-border/40 pb-3'>
							<div className='w-full sm:w-fit flex items-center gap-2'>
								<MessageSquareIcon className='size-6 text-brand-primary' />
								<span className='font-bold text-muted-foreground'>{t('messages.writeMessage')}</span>
							</div>

							{/* Settings: Anonymous & Confidentiality toggles */}
							{user && !isAuthLoading && (
								<div className='w-full sm:w-fit flex justify-between items-center gap-4'>
									<div className='flex items-center gap-2'>
										<Label htmlFor='anon-switch' className='text-xs text-muted-foreground cursor-pointer'>
											{isAnonymous ? t('messages.anonymousSender') : t('messages.revealIdentity')}
										</Label>
										<Switch id='anon-switch' checked={isAnonymous} onCheckedChange={setIsAnonymous} />
									</div>

									<div className='flex items-center gap-2 border-s border-border/60 ps-4'>
										<Label
											htmlFor='confidential-switch'
											className='text-xs text-muted-foreground cursor-pointer flex items-center gap-1'
										>
											{isPublic ? (
												<UnlockIcon className='w-3 h-3' />
											) : (
												<LockIcon className='w-3 h-3 text-amber-500' />
											)}
											{t('messages.public')}
										</Label>
										<Switch id='confidential-switch' checked={isPublic} onCheckedChange={setIsPublic} />
									</div>
								</div>
							)}
						</div>

						{/* Main Textarea Input */}
						<div className='relative group'>
							<Textarea
								value={messageText}
								onChange={(e) => setMessageText(e.target.value)}
								placeholder={t('messages.attachments.textareaPlaceholder')}
								rows={5}
								maxLength={appConfig.messages.maxLength || 1000}
								className='min-h-32 pb-9'
								// className='w-full p-4 bg-background/40 focus-visible:ring-brand-primary/50 rounded-2xl resize-none text-base border border-border/40 transition-all duration-200'
							/>
							<div className='absolute bottom-3 inset-e-3 w-full ps-6 flex justify-between items-center'>
								<span className='text-[10px] text-muted-foreground bg-background/80 px-2 py-0.5 rounded-md backdrop-blur-sm border border-border/30'>
									{messageText.length}/{appConfig.messages.maxLength || 1000}
								</span>
								<EmojiPicker
									onEmojiSelect={handleEmojiSelect}
									trigger={
										<Button type='button' variant='link' size='icon-sm'>
											<SmileIcon className='h-4 w-4' />
										</Button>
									}
								/>
							</div>
						</div>

						{/* Drag and Drop Zone Area (Visible when files empty or hovered) */}
						{attachments.length === 0 && (
							<div
								onClick={() => fileInputRef.current?.click()}
								className='border-2 border-dashed border-border/60 hover:border-brand-primary/40 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-secondary/60 hover:bg-secondary/40 transition-all duration-200 group'
							>
								<UploadCloudIcon className='w-6 h-6 text-muted-foreground group-hover:text-brand-primary transition-colors' />
								<p className='text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors'>
									{t('messages.attachments.dragAndDropText')}
								</p>
								<span className='text-[10px] text-muted-foreground/70'>
									{t('messages.attachments.dragAndDropLimit')}
								</span>
							</div>
						)}

						{/* Dynamic Attachments Preview Grid */}
						{attachments.length > 0 && (
							<div className='space-y-2'>
								<div className='flex items-center justify-between text-xs text-muted-foreground'>
									<span>
										{t('messages.attachments.title')} ({attachments.length}/4)
									</span>
									<Button
										type='button'
										variant='ghost'
										size='sm'
										className='h-auto p-1 text-xs text-rose-500 hover:bg-rose-500/10'
										onClick={() => setAttachments([])}
									>
										{t('common.clearAll')}
									</Button>
								</div>
								<div className='grid grid-cols-4 gap-3'>
									{attachments.map((file, idx) => {
										const isImage = file.type.startsWith('image/');
										return (
											<div
												key={idx}
												className='relative aspect-square rounded-xl overflow-hidden border border-border/80 group bg-muted/80'
											>
												{isImage ? (
													<img
														src={URL.createObjectURL(file)}
														alt='preview'
														className='w-full h-full object-cover'
													/>
												) : (
													<div className='w-full h-full flex items-center justify-center text-[10px] text-muted-foreground font-semibold p-1 text-center truncate bg-brand-secondary/10'>
														Video file
													</div>
												)}
												<button
													type='button'
													onClick={() => removeAttachment(idx)}
													className='absolute top-1 inset-e-1 p-1 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shadow-md'
												>
													<XIcon className='w-3 h-3' />
												</button>
											</div>
										);
									})}

									{attachments.length < 4 && (
										<button
											type='button'
											onClick={() => fileInputRef.current?.click()}
											className='aspect-square rounded-xl border-2 border-dashed border-border/80 hover:border-brand-primary flex flex-col items-center justify-center text-muted-foreground hover:text-brand-primary bg-secondary/10 hover:bg-secondary/30 transition-all duration-200'
										>
											<PaperclipIcon className='w-5 h-5' />
										</button>
									)}
								</div>
							</div>
						)}

						{/* Hidden native input */}
						<input
							type='file'
							ref={fileInputRef}
							className='hidden'
							multiple
							accept='image/*,video/*'
							onChange={(e) => e.target.files && handleFiles(e.target.files)}
						/>

						{/* Form Actions Section */}
						<div className='flex items-center justify-end border-t border-border/40 pt-4'>
							{/* Submit Action Button */}
							<Button
								type='submit'
								size='lg'
								disabled={isPending}
								className='rounded-xl  text-white px-6 gap-2 font-semibold min-w-[120px] transition-all duration-200 active:scale-95'
							>
								{isPending ? (
									<>
										{t('messages.send.sending')}
										<Loader2Icon className='w-4 h-4 animate-spin' />
									</>
								) : (
									<>
										{t('messages.send.button') || 'إرسال الصراحة'}
										<SendIcon className='w-4 h-4 transform rotate-180 rtl:rotate-0' />
									</>
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>

			{/* ================= SECTION 3: PUBLIC TIMELINE FEED ================= */}
			<div className='space-y-4 pt-4'>
				<div className='flex items-center gap-2 border-b border-border/40 pb-2'>
					<div className='h-4 w-1 bg-brand-primary rounded-full' />
					<h2 className='text-lg font-bold tracking-tight'>{t('messages.publicMessagesTitle')}</h2>
				</div>

				<div className='space-y-4 min-h-[200px]'>
					{isLoading ? (
						Array.from({ length: 2 }).map((_, idx) => <MessageSkeletonCard key={idx} />)
					) : messages && messages?.length > 0 ? (
						<>
							{messages?.map((message) => (
								<MessageCard
									key={(message as Message).id}
									message={message as Message}
									tab={MessageTypeEnum.INBOX}
									isAuthed={false}
								/>
							))}

							{/* ================= SECTION 4: ADVANCED PAGINATION CONTROLS ================= */}
							{metadata && metadata?.totalPages > 1 && (
								<MessagesPagination {...{ metadata, currentPage, setCurrentPage, isFetching: isLoading }} />
							)}
						</>
					) : (
						<EmptyMessages />
					)}
				</div>
			</div>
		</div>
	);
}
