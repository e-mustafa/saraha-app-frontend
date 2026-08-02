'use client';

import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { IResponse } from '@/shared/types/index';
import { apiClient } from '@/shared/utils/apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2Icon, UserXIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { toast } from 'sonner';
import { BlockedUser, UserProfile } from '../types/database';

interface BlockedUsersModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function BlockedUsersModal({ isOpen, onClose }: BlockedUsersModalProps) {
	const t = useTranslations();
	const queryClient = useQueryClient();

	// Fetch Blocked Users
	const { data: blockedUsers, isLoading } = useQuery({
		queryKey: ['blocked-users'],
		queryFn: async () => {
			const response = await apiClient.get<IResponse<{ blockedUsers: BlockedUser[] }>>('/users/block');
			return response.data?.blockedUsers || [];
		},
		enabled: isOpen, // Fetch only when modal is open
	});

	console.log('blockedUsers', blockedUsers);

	// Unblock User Mutation
	const { mutate: unblockUser, isPending: isUnblocking } = useMutation({
		mutationFn: async (userId: string) => {
			return await apiClient.delete<IResponse<UserProfile>>(`/users/block/${userId}`);
		},
		onSuccess: (res: IResponse<UserProfile>, userId) => {
			// toast.success(t('profile.blockedUsers.unblockSuccess') || 'User unblocked successfully');
			// Update query cache optimistically or invalidate
			queryClient.setQueryData(['blocked-users'], (old: BlockedUser[] | undefined) => {
				return { ...old, ...res.data };
			});
		},
		onError: (err: unknown) => {
			toast.error((err as Error)?.message || 'Failed to unblock user');
		},
	});

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-md bg-card-glass backdrop-blur-lg max-h-[80vh] flex flex-col'>
				<DialogHeader>
					<DialogTitle className='flex items-center gap-2'>
						<UserXIcon className='w-5 h-5 text-destructive' />
						{t('profile.blockedUsers.title') || 'Blocked Users'}
					</DialogTitle>
				</DialogHeader>

				<div className='flex-1 overflow-y-auto space-y-4 py-4 pr-1'>
					{isLoading ? (
						<div className='flex justify-center py-8'>
							<Loader2Icon className='w-6 h-6 animate-spin text-muted-foreground' />
						</div>
					) : blockedUsers && blockedUsers.length > 0 ? (
						blockedUsers.map((blockedUser) => (
							<div
								key={blockedUser.id}
								className='flex items-center justify-between p-3 rounded-xl bg-bg-main/50 border border-border/10 gap-3'
							>
								<div className='flex items-center gap-3 min-w-0'>
									<Image
										src={blockedUser.avatar?.url || '/images/default-avatar.png'}
										alt={blockedUser.username}
										width={40}
										height={40}
										className='w-10 h-10 rounded-full object-cover shrink-0'
									/>
									<div className='min-w-0 flex-1'>
										<p className='text-sm font-semibold text-foreground truncate'>
											{blockedUser.firstName} {blockedUser.lastName}
										</p>
										<p className='text-xs text-muted-foreground truncate'>@{blockedUser.username}</p>
									</div>
								</div>

								<Button
									type='button'
									variant='outline'
									size='sm'
									className='text-destructive hover:bg-destructive/10 shrink-0'
									disabled={isUnblocking}
									onClick={() => unblockUser(blockedUser.id||blockedUser._id)}
								>
									{t('profile.blockedUsers.unblock') || 'Unblock'}
								</Button>
							</div>
						))
					) : (
						<p className='text-center text-sm text-muted-foreground py-8'>
							{t('profile.blockedUsers.empty') || 'No blocked users found.'}
						</p>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
