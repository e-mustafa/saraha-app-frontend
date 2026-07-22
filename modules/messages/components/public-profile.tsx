'use client';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import { usePublicProfile } from '@/modules/profile/hooks/use-public';
import { UserProfile } from '@/modules/profile/types/database';
import { IResponse } from '@/shared/types/index';
import { apiClient } from '@/shared/utils/apiClient';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
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

	// Fetch essential core states
	const { user, isLoading: isAuthLoading } = useAuth();
	const { data: targetUser, isLoading: isTargetUserLoading } = usePublicProfile(username || '');

	// Fetch paginated messages with query key tracking and structural placeholder
	const {
		data,
		isLoading: isMessagesLoading,
		isFetching,
	} = useQuery({
		queryKey: ['public-messages', username, currentPage],
		queryFn: async () => {
			const response = await apiClient.get<IResponse<Message[]>>(
				`/messages/public/${username}?page=${currentPage}&limit=10`,
			);
			return response;
		},
		enabled: !!username,
		staleTime: 1000 * 10,
		placeholderData: keepPreviousData, // Keeps old page data visible during new page transit
	});

	const messages = data?.data;
	const metadata = data?.metadata;

	// Critical initial loading state (Only for profile identity shell)
	if (isAuthLoading || isTargetUserLoading) {
		return <PublicProfileSkeleton />;
	}

	// Handle non-existent profiles securely
	if (!targetUser) {
		return <PublicProfileNotFound />;
	}

	return (
		<div className='w-full max-w-3xl mx-auto px-4 py-8 space-y-8 overflow-hidden'>
			{/* SECTION 1: TARGET USER IDENTITY CARD */}
			<UserSection user={targetUser} />

			{/* SECTION 2: SMART CONCEALED MESSAGING BOX */}
			<SendMessageForm userId={targetUser?.id || targetUser?._id || ''} currentUser={user as UserProfile} />

			{/* SECTION 3: PUBLIC TIMELINE FEED */}
			<div className='space-y-4 pt-4'>
				<div className='flex items-center gap-2 border-b border-border/40 pb-2'>
					<div className='h-4 w-1 bg-brand-primary rounded-full' />
					<h2 className='text-lg font-bold tracking-tight'>{t('messages.publicMessagesTitle')}</h2>
				</div>

				{/* Added dynamic opacity to indicate network fetching while previous data is rendered */}
				<div
					className={`space-y-4 min-h-[200px] transition-opacity duration-200 ${isFetching && !isMessagesLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}
				>
					{isMessagesLoading ? (
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
								<MessagesPagination
									metadata={metadata}
									currentPage={currentPage}
									setCurrentPage={setCurrentPage}
									isFetching={isFetching}
								/>
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
