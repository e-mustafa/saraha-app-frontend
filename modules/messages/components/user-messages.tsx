'use client';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { IResponse } from '@/shared/types/index';
import { apiClient } from '@/shared/utils/apiClient';
import { useQuery } from '@tanstack/react-query';
import { HeartIcon, InboxIcon, SendIcon, UsersRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { MessageTypeEnum } from '../enums';
import { Message, MessageType } from '../types/index';
import EmptyMessages from './empty-messages';
import MessageCard from './message-card';
import MessageSkeletonCard from './message-skeleton-card';
import MessagesPagination from './messages-pagination';
import UserSection from './user-section';

export type TabType = MessageType;

// export interface SarahaDashboardProps {
// 	user: Partial<UserProfile>;
// }

export default function UserMessages() {
	const t = useTranslations();
	const [activeTab, setActiveTab] = useState<TabType>(MessageTypeEnum.INBOX);
	const [currentPage, setCurrentPage] = useState<number>(1);

	const { user, isAuthed } = useAuth();

	// fetch messages dynamically using React Query based on the current tab and page
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ['messages', activeTab, currentPage],
		queryFn: async () => {
			const response = await apiClient.get<IResponse<Message[]>>(
				`/messages/?type=${activeTab}&page=${currentPage}&limit=10`,
			);
			return response;
		},
		// staleTime: 1000 * 60 * 2, // دقيقتين لمنع التكرار غير الضروري
	});

	const { data: messages, metadata } = data || {};

	// const profileLink = getTenantUrl('mustafa', '/ar');
	// const currentUrl = getAppUrl();

	return (
		<div className='w-full max-w-4xl mx-auto overflow-hidden px-4 py-8 space-y-8 direction-rtlxxx'>
			{/* ================= SECTION 1: IDENTITY CARD (HIGH-TECH GLASS) ================= */}
			<UserSection user={user || {}} />

			{/* ================= SECTION 2: NAVIGATION TABS SYSTEM ================= */}
			<Tabs
				defaultValue={MessageTypeEnum.INBOX}
				className='w-full space-y-6'
				onValueChange={(value) => {
					setActiveTab(value as TabType);
					setCurrentPage(1); // إعادة تصفير الترقيم عند التبديل
				}}
			>
				<TabsList className='grid w-full min-h-fit grid-cols-4 p-1 bg-muted/50 rounded-2xl border border-border/40 backdrop-blur-md'>
					<TabsTrigger
						value={MessageTypeEnum.INBOX}
						className='rounded-xl py-3 gap-2 text-sm font-medium transition-all data-[state=active]:bg-card data-[state=active]:shadow-sm'
					>
						<InboxIcon className='w-4 h-4 text-brand-primary' />
						<span>{t('messages.tabs.inbox')}</span>
					</TabsTrigger>
					<TabsTrigger
						value={MessageTypeEnum.SENT}
						className='rounded-xl py-3 gap-2 text-sm font-medium transition-all data-[state=active]:bg-card data-[state=active]:shadow-sm'
					>
						<SendIcon className='w-4 h-4 text-brand-secondary' />
						<span>{t('messages.tabs.sent')}</span>
					</TabsTrigger>
					<TabsTrigger
						value={MessageTypeEnum.FAVORITES}
						className='rounded-xl py-3 gap-2 text-sm font-medium transition-all data-[state=active]:bg-card data-[state=active]:shadow-sm'
					>
						<HeartIcon className='w-4 h-4 text-rose-500' />
						<span>{t('messages.tabs.favorites')}</span>
					</TabsTrigger>
					<TabsTrigger
						value={MessageTypeEnum.PUBLIC}
						className='rounded-xl py-3 gap-2 text-sm font-medium transition-all data-[state=active]:bg-card data-[state=active]:shadow-sm'
					>
						<UsersRound className='w-4 h-4 text-rose-500' />
						<span>{t('messages.tabs.public')}</span>
					</TabsTrigger>
				</TabsList>

				{/* ================= SECTION 3: MESSAGES FEED AREA ================= */}
				<div className='space-y-4 min-h-[400px]'>
					{isLoading || isFetching ? (
						Array.from({ length: 3 }).map((_, idx) => <MessageSkeletonCard key={idx} />)
					) : messages && messages?.length > 0 ? (
						// messages?.map((message: Message) => <MessageCard key={message.id} message={message} tab={activeTab} />)
						messages?.map((message) => (
							<MessageCard
								key={(message as Message).id}
								message={message as Message}
								tab={activeTab}
								isAuthed={isAuthed}
							/>
						))
					) : (
						// حالة عدم وجود رسائل
						<EmptyMessages />
					)}
				</div>
			</Tabs>
			{/* ================= SECTION 4: ADVANCED PAGINATION CONTROLS ================= */}
			{metadata && metadata?.totalPages > 1 && !isLoading && (
				<MessagesPagination {...{ metadata, currentPage, setCurrentPage, isFetching }} />
			)}
		</div>
	);
}
