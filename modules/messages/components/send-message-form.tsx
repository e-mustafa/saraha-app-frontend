'use client';

import { UserProfile } from '@/modules/profile/types/database';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { IResponse } from '@/shared/types/index';
import { apiClient } from '@/shared/utils/apiClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquareIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import MessageInput from './message-input';

interface SendMessageFormProps {
	username: string;
	currentUser: UserProfile;
}

interface SendMessagePayload {
	messageText: string;
	audioBlob: Blob | null;
	attachments: File[];
}

export default function SendMessageForm({ username, currentUser }: SendMessageFormProps) {
	const t = useTranslations();
	const queryClient = useQueryClient();

	// Form toggles
	const [isPublic, setIsPublic] = useState(false);
	const [isAnonymous, setIsAnonymous] = useState(true);

	// Using mutateAsync to return a Promise that can be awaited by the child component
	const { mutateAsync: sendMessage, isPending } = useMutation({
		mutationFn: async ({ messageText, audioBlob, attachments }: SendMessagePayload) => {
			const formData = new FormData();
			formData.append('content', messageText);
			formData.append('isAnonymous', String(isAnonymous));

			// Append recorded audio file to the attachments field
			if (audioBlob) {
				formData.append('attachments', audioBlob, 'voice-note.webm');
			}

			// Append other file attachments to the attachments field
			if (attachments?.length) {
				attachments.forEach((file) => {
					formData.append('attachments', file);
				});
			}

			return await apiClient.post<IResponse<null>>(`/messages/public/${username}`, formData);
		},

		onSuccess: () => {
			setIsPublic(false);
			// Refresh query data instantly
			queryClient.invalidateQueries({ queryKey: ['public-messages', username] });
		},
	});

	// Handle the form submission by returning the mutateAsync promise
	const handleSend = async (payload: SendMessagePayload) => {
		if (!payload.messageText.trim() && !payload.audioBlob && payload.attachments.length === 0) {
			toast.error(t('messages.errors.emptyMessage'));
			// Throw error to prevent the child component from clearing its state
			throw new Error('Validation failed: Empty message');
		}

		// Return the promise so that MessageInput can properly catch errors
		await sendMessage(payload);
	};

	return (
		<Card className='overflow-hidden bg-card-blur rounded-3xl border border-white/10 dark:border-white/5 shadow-xl'>
			<CardContent className='sm:px-6 space-y-4 relative'>
				{/* Form Header Settings Controls */}
				<div className='flex flex-col sm:flex-row gap-4 items-start justify-between border-b border-border/40 pb-3'>
					<div className='w-full sm:w-fit flex items-center gap-2'>
						<MessageSquareIcon className='size-6 text-brand-primary' />
						<span className='font-bold text-muted-foreground'>{t('messages.writeMessage')}</span>
					</div>

					{/* Render options only if user is logged in */}
					{currentUser && (
						<div className='w-full sm:w-fit flex justify-between items-center gap-4'>
							<div className='flex items-center gap-2'>
								<Label htmlFor='anon-switch' className='text-xs text-muted-foreground cursor-pointer'>
									{isAnonymous ? t('messages.anonymousSender') : t('messages.revealIdentity')}
								</Label>
								<Switch id='anon-switch' checked={isAnonymous} onCheckedChange={setIsAnonymous} />
							</div>

							{/* <div className='flex items-center gap-2 border-s border-border/60 ps-4'>
								<Label
									htmlFor='confidential-switch'
									className='text-xs text-muted-foreground cursor-pointer flex items-center gap-1'
								>
									{isPublic ? (
										<UnlockIcon className='w-3.5 h-3.5' />
									) : (
										<LockIcon className='w-3.5 h-3.5 text-amber-500' />
									)}
									{t('messages.public')}
								</Label>
								<Switch id='confidential-switch' checked={isPublic} onCheckedChange={setIsPublic} />
							</div> */}
						</div>
					)}
				</div>

				{/* Nested Message Input */}
				<MessageInput onSend={handleSend} isLoading={isPending} />
			</CardContent>
		</Card>
	);
}
