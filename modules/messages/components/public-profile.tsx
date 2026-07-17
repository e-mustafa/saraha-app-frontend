'use client';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import { usePublicProfile } from '@/modules/profile/hooks/use-public';
import { IResponse } from '@/shared/types/index';
import { apiClient } from '@/shared/utils/apiClient';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { MessageTypeEnum } from '../enums';
import { Message } from '../types/index';
import EmptyMessages from './empty-messages';
import MessageCard from './message-card';
import MessageSkeletonCard from './message-skeleton-card';
import MessagesPagination from './messages-pagination';
import PublicProfileNotFound from './public-profile-not-found';
import PublicProfileSkeleton from './public-profile-skeleton';
import SendMessageForm from './send-message-form';
import UserSection from './user-section';

interface PublicProfileProps {
	username: string;
}

export default function PublicProfile({ username }: PublicProfileProps) {
	const t = useTranslations();
	const [currentPage, setCurrentPage] = useState<number>(1);

	// Fetch authentication state here (at the top level container)
	const { user, isLoading: isAuthLoading } = useAuth();
	const { data: targetUser, isLoading: isTargetUserLoading } = usePublicProfile(username || '');

	// Fetch public messages with cache optimizations to prevent 429 spam
	const { data, isLoading } = useQuery({
		queryKey: ['public-messages', username, currentPage],
		queryFn: async () => {
			const response = await apiClient.get<IResponse<Message[]>>(
				`/messages/public/${username}?page=${currentPage}&limit=10`,
			);
			return response;
		},
		enabled: !!username,
		staleTime: 1000 * 10, // Cache results for 10 seconds to avoid rapid refetching
	});

	const { data: messages, metadata } = data || {};

	// Global loading state (unified to avoid loading skeletons flickering)
	if (isLoading || isAuthLoading || isTargetUserLoading) {
		return <PublicProfileSkeleton />;
	}

	if (!targetUser) {
		return <PublicProfileNotFound />;
	}

	return (
		<div className='w-full max-w-3xl mx-auto px-4 py-8 space-y-8 overflow-hidden'>
			{/* SECTION 1: TARGET USER IDENTITY CARD */}
			<UserSection user={targetUser} />

			{/* SECTION 2: SMART CONCEALED MESSAGING BOX - Pass the pre-loaded user state down */}
			<SendMessageForm username={username} currentUser={user! || {}} />

			{/* SECTION 3: PUBLIC TIMELINE FEED */}
			<div className='space-y-4 pt-4'>
				<div className='flex items-center gap-2 border-b border-border/40 pb-2'>
					<div className='h-4 w-1 bg-brand-primary rounded-full' />
					<h2 className='text-lg font-bold tracking-tight'>{t('messages.publicMessagesTitle')}</h2>
				</div>

				<div className='space-y-4 min-h-[200px]'>
					{isLoading ? (
						Array.from({ length: 2 }).map((_, idx) => <MessageSkeletonCard key={idx} />)
					) : messages && messages.length > 0 ? (
						<>
							{messages.map((message) => (
								<MessageCard
									key={(message as Message).id}
									message={message as Message}
									tab={MessageTypeEnum.INBOX}
									isAuthed={false}
								/>
							))}

							{/* SECTION 4: ADVANCED PAGINATION CONTROLS */}
							{metadata && metadata.totalPages > 1 && (
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
