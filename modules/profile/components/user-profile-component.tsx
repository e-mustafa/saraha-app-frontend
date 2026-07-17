'use client';

import { useRouter } from '@/i18n/navigation';
import ShareButton from '@/modules/messages/components/share-button';
import { Button } from '@/shared/components/ui/button';
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
import { APP_ROUTES, defaultImages } from '@/shared/config/app-configs';
import { useFormatDate } from '@/shared/hooks/use-format-date';
import { IResponse } from '@/shared/types/index';
import { apiClient } from '@/shared/utils/apiClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	ArrowLeftIcon,
	CameraIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	Edit3Icon,
	Loader2Icon,
	LockIcon,
	MailIcon,
	PlusIcon,
	ReplaceIcon,
	Trash2Icon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import { UserImage, UserProfile } from '../types/database';
import ImageUploadModal from './image-upload-modal';
import ProfileForm from './profile-form';
import UserProfileSkeleton from './user.profile-skeleton';

export default function UserProfileComponent() {
	const t = useTranslations();
	const router = useRouter();
	const format = useFormatDate();
	const queryClient = useQueryClient();

	const [isEditMode, setIsEditMode] = useState(false);
	const [currentCoverIndex, setCurrentCoverIndex] = useState(0);
	const [replaceCover, setReplaceCover] = useState<string | null>(null);

	// Manage modal state for both types (null means closed)
	const [uploadTarget, setUploadTarget] = useState<'avatar' | 'cover' | 'replace' | null>(null);

	const {
		data: user,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['profile'],
		queryFn: async () => {
			const response = await apiClient.get<IResponse<UserProfile>>('/users/profile');
			return response.data as UserProfile;
		},
		// initialData: initialData, // Prevents loading skeleton flash on initial load
		retry: 1,
		staleTime: 1000 * 60 * 5,
		throwOnError: true,
	});

	// 1. Mutation لحذف صورة الغلاف من الباك اند وتحديث الكاش
	const { mutate: deleteCover, isPending: isDeletingCover } = useMutation({
		mutationFn: async (id: string) => {
			// const body = coverUrl ? { image: coverUrl } : undefined;
			const response = await apiClient.delete(`/users/${id ? 'profile-covers' : 'profile-avatar'}`, id ? { id } : {});
			return response as IResponse<Partial<UserProfile>>;
		},
		onSuccess: (res) => {
			// toast.success(res.message || t('profile.images.coverDeleted'));

			// دمج البيانات الجديدة القادمة من الباك اند (التي تحتوي على مصفوفة الـ covers المحدثة)
			queryClient.setQueryData(['profile'], (oldData: UserProfile | undefined) => {
				if (!oldData) return oldData;
				return {
					...oldData,
					...res.data,
				};
			});

			// إعادة مؤشر الكاروسيل للبداية بأمان
			setCurrentCoverIndex(0);
		},
		onError: (error) => {
			console.error('Delete Error:', error);
			// toast.error(error?.message || t('errors.deleteFailed') || 'Failed to delete cover');
		},
	});

	console.log('user?.avatar', user?.avatar);
	// Derived State: Calculate avatar URL dynamically from the current query cache
	const avatar =
		user?.avatar.url || (user?.gender === 0 ? defaultImages?.avatarMale || '' : defaultImages?.avatarFemale || '');

	// Derived State: Calculate covers array dynamically from the current query cache
	const covers =
		user?.covers && user.covers.length > 0 ? user.covers : [{ id: 'default-cover', url: defaultImages?.cover || '' }];

	const handleImageUploadSuccess = (userImage: UserImage | UserImage[]) => {
		if (uploadTarget === 'cover' && Array.isArray(userImage)) {
			// Snap the carousel to the newly added cover image
			setCurrentCoverIndex(Math.max(0, userImage.length - 1));
		}
	};

	const handleReplaceCover = () => {
		setUploadTarget('replace');
		setReplaceCover(user?.covers[currentCoverIndex]?.id || '');
	};

	const removeCover = () => {
		if (!user || !user.covers || !user.covers[currentCoverIndex]) return;
		// تمرير رابط الصورة المراد حذفها للباك اند
		deleteCover(user.covers[currentCoverIndex]?.id);
	};

	const handleClose = () => {
		setUploadTarget(null);
		setReplaceCover(null);
	};

	if (isLoading) return <UserProfileSkeleton />;
	if (error) {
		toast.error('Session Expired. Please login again.');
	}

	// Calculate remaining allowable covers based on derived state (Max limit is 2)
	const activeCoversCount = covers.filter((c) => !c.url.includes('user-cover-placeholder.webp')).length;
	const remainingCoversAllowed = Math.max(0, 2 - activeCoversCount);

	return (
		<div className='w-full mx-auto pb-16'>
			{/* Top Identity Card and Covers */}
			<div className='relative h-64 sm:h-80 w-full group overflow-hidden transition-all duration-200 shadow-md'>
				<Image
					src={covers[currentCoverIndex].url || defaultImages?.cover || ''}
					alt='Cover'
					className='w-full h-full object-cover'
					width={1200}
					height={800}
					priority
				/>

				<div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent' />

				{/* Carousel navigation arrows */}
				{covers.length > 1 && (
					<>
						<Button
							type='button'
							variant='ghost'
							size='icon'
							className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity'
							onClick={() => setCurrentCoverIndex((prev) => (prev === 0 ? covers.length - 1 : prev - 1))}
						>
							<ChevronLeftIcon className='w-5 h-5' />
						</Button>
						<Button
							type='button'
							variant='ghost'
							size='icon'
							className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity'
							onClick={() => setCurrentCoverIndex((prev) => (prev === covers.length - 1 ? 0 : prev + 1))}
						>
							<ChevronRightIcon className='w-5 h-5' />
						</Button>
					</>
				)}

				{/* Cover Action Controls */}
				<div className='absolute top-4 inset-e-4 flex gap-2 z-30'>
					{remainingCoversAllowed > 0 && (
						<Button
							type='button'
							size='sm'
							variant='outline'
							className='text-white/80 hover:bg-white backdrop-blur-md gap-1.5'
							onClick={() => setUploadTarget('cover')}
						>
							<PlusIcon className='w-4 h-4' /> <span>{t('forms.upload.addCover')}</span>
						</Button>
					)}
					{activeCoversCount > 0 && (
						<div className='flex gap-2 items-center'>
							<Button
								type='button'
								size='sm'
								variant='outline'
								className='text-white/80 hover:bg-white backdrop-blur-md gap-1.5'
								onClick={handleReplaceCover}
							>
								<ReplaceIcon className='w-4 h-4' /> <span>{t('forms.upload.replaceCover')}</span>
							</Button>

							<Dialog>
								<DialogTrigger asChild>
									<Button
										type='button'
										size='icon'
										variant='destructive'
										className='backdrop-blur-md'
										disabled={isDeletingCover}
									>
										{isDeletingCover ? (
											<Loader2Icon className='w-4 h-4 animate-spin' />
										) : (
											<Trash2Icon className='w-4 h-4' />
										)}
									</Button>
								</DialogTrigger>
								<DialogContent className='sm:max-w-sm bg-card-glass backdrop-blur-lg'>
									<DialogHeader>
										<DialogTitle>{t('profile.deleteCoverDialog.title')}</DialogTitle>
										<DialogDescription>{t('profile.deleteCoverDialog.description')}</DialogDescription>
									</DialogHeader>

									<DialogFooter className='py-2'>
										<DialogClose asChild>
											<Button variant='outline'>{t('profile.deleteCoverDialog.cancel')}</Button>
										</DialogClose>
										<Button type='submit' variant='destructive' disabled={isDeletingCover} onClick={removeCover}>
											{isDeletingCover ? (
												<Loader2Icon className='w-4 h-4 animate-spin' />
											) : (
												t('profile.deleteCoverDialog.confirm')
											)}
										</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					)}
				</div>

				{/* Carousel Pagination Indicators */}
				{covers.length > 1 && (
					<div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10'>
						{covers?.map((_, idx) => (
							<span
								key={idx}
								className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentCoverIndex ? 'w-6 bg-brand-primary' : 'w-1.5 bg-white/60'}`}
							/>
						))}
					</div>
				)}
			</div>

			{/* Avatar and Profile Header Info */}
			<div className='relative container mx-auto mt-4 bg-card-glass bg-linear-to-t from-brand-primary/10 via-transparent to-transparent rounded-3xl shadow-xl border border-border/40 transition-all duration-300'>
				<div className='relative px-6 pb-6 pt-20 sm:pt-4 flex items-center gap-4'>
					<div className='absolute sm:relative -top-16 sm:top-0 left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-start'>
						<div className='relative -mt-32 z-20 w-44 h-44 rounded-2xl bg-black/50 border-4 border-primary/60 shadow-md group/avatar overflow-hidden'>
							<div className='absolute z-100 inset-e-2 bottom-2 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200'>
								{user?.avatar?.url && (
									<Dialog>
										<DialogTrigger asChild>
											<Button
												type='button'
												size='icon'
												variant='destructive'
												className='backdrop-blur-md'
												disabled={isDeletingCover}
											>
												{isDeletingCover ? (
													<Loader2Icon className='w-4 h-4 animate-spin' />
												) : (
													<Trash2Icon className='w-4 h-4' />
												)}
											</Button>
										</DialogTrigger>
										<DialogContent className='sm:max-w-sm bg-card-glass backdrop-blur-lg'>
											<DialogHeader>
												<DialogTitle>{t('profile.deleteAvatarDialog.title')}</DialogTitle>
												<DialogDescription>{t('profile.deleteAvatarDialog.description')}</DialogDescription>
											</DialogHeader>

											<DialogFooter className='py-2'>
												<DialogClose asChild>
													<Button variant='outline'>{t('profile.deleteAvatarDialog.cancel')}</Button>
												</DialogClose>
												<Button
													type='submit'
													variant='destructive'
													disabled={isDeletingCover}
													onClick={() => deleteCover('')}
												>
													{isDeletingCover ? (
														<Loader2Icon className='w-4 h-4 animate-spin' />
													) : (
														t('profile.deleteAvatarDialog.confirm')
													)}
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								)}
							</div>
							<Image
								src={avatar}
								alt='Avatar'
								width={176}
								height={176}
								className='w-full h-full object-cover rounded-xl'
							/>
							<button
								type='button'
								className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200'
								onClick={() => setUploadTarget('avatar')}
							>
								<CameraIcon className='w-6 h-6 text-white' />
							</button>
						</div>
					</div>
					<div className='flex gap-4 justify-between items-center flex-1'>
						<div className='sm:mb-2'>
							<h2 className='text-2xl font-bold text-foreground'>
								{user?.firstName} {user?.lastName}
							</h2>
							<p className='text-sm text-muted-foreground'>@{user?.username || ''}</p>
						</div>
						<ShareButton username={user?.username || ''} />
					</div>
				</div>
			</div>

			{/* Form & Profile Details Area */}
			<div className='container mx-auto mt-6 bg-linear-to-br from-accent/20 to-brand-secondary/20 rounded-3xl p-6 sm:p-8 shadow-lg border border-border/40'>
				<div className='flex gap-2 justify-end pb-8'>
					{!isEditMode ? (
						<>
							<Button type='button' variant='outline' onClick={() => setIsEditMode(true)}>
								<Edit3Icon className='w-4 h-4 mr-2' /> {t('common.edit')}
							</Button>
							<Button
								type='button'
								variant='outline'
								className='text-brand-primary'
								onClick={() => router.push(APP_ROUTES.changePassword || '/user/change-password')}
							>
								<LockIcon className='w-4 h-4 mr-2' /> {t('auth.changePassword.title')}
							</Button>
							<Button
								type='button'
								variant='outline'
								className='text-brand-primary'
								onClick={() => router.push(APP_ROUTES.requestChangeEmail || '/user/request-change-email')}
							>
								<MailIcon className='w-4 h-4 mr-2' /> {t('auth.changeEmail.title')}
							</Button>
						</>
					) : (
						<Button type='button' variant='ghost' onClick={() => setIsEditMode(false)}>
							<ArrowLeftIcon className='w-4 h-4 mr-2' /> {t('common.cancel')}
						</Button>
					)}
				</div>

				{!isEditMode ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
						<div className='p-3 rounded-xl bg-bg-main/50 border border-border/10'>
							<span className='text-xs text-muted-foreground block'>{t('forms.labels.firstName')}</span>
							<span className='text-base font-medium text-foreground'>{user?.firstName || '—'}</span>
						</div>
						<div className='p-3 rounded-xl bg-bg-main/50 border border-border/10'>
							<span className='text-xs text-muted-foreground block'>{t('forms.labels.lastName')}</span>
							<span className='text-base font-medium text-foreground'>{user?.lastName || '—'}</span>
						</div>
						<div className='p-3 rounded-xl bg-bg-main/50 border border-border/10'>
							<span className='text-xs text-muted-foreground block'>{t('forms.labels.username')}</span>
							<span className='text-base font-medium text-foreground'>@{user?.username || '—'}</span>
						</div>
						<div className='p-3 rounded-xl bg-bg-main/50 border border-border/10'>
							<span className='text-xs text-muted-foreground block'>{t('forms.labels.email')}</span>
							<span className='text-base font-medium text-foreground'>{user?.email || '—'}</span>
						</div>
						<div className='space-y-1 p-3 rounded-xl bg-bg-main/50 border border-border/10'>
							<span className='text-xs text-muted-foreground block'>{t('forms.labels.phone')}</span>
							<span className='text-base font-medium text-foreground truncate line-clamp-1'>
								{user?.phone || '—'}
							</span>
						</div>
						<div className='space-y-1 p-3 rounded-xl bg-bg-main/50 border border-border/10'>
							<span className='text-xs text-muted-foreground block'>{t('forms.labels.gender')}</span>
							<span className='text-base font-medium text-foreground'>
								{user?.gender == 0 ? t('forms.labels.male') : t('forms.labels.female')}
							</span>
						</div>
						<div className='space-y-1 p-3 rounded-xl bg-bg-main/50 border border-border/10 flex gab-2 justify-between'>
							<div className=''>
								<span className='text-xs text-muted-foreground block'>{t('forms.labels.birthdate')}</span>
								<span className='text-base font-medium text-foreground'>
									{user?.birthdate ? format(user?.birthdate) : '—'}
								</span>
							</div>
							<div className=''>
								<span className='text-xs text-muted-foreground block'>{t('forms.labels.age')}</span>
								<span className='text-base font-medium text-foreground'>{user?.age || '—'}</span>
							</div>
						</div>
						<div className='space-y-1 p-3 rounded-xl bg-bg-main/50 border border-border/10'>
							<span className='text-xs text-muted-foreground block'>{t('forms.labels.bio')}</span>
							<span className='text-base font-medium text-foreground truncate line-clamp-1'>{user?.bio || '—'}</span>
						</div>
					</div>
				) : (
					<ProfileForm initialData={user} onClose={() => setIsEditMode(false)} onSuccess={() => setIsEditMode(false)} />
				)}
			</div>

			{/* Unified Image Upload Modal */}
			<ImageUploadModal
				isOpen={uploadTarget !== null}
				mode={uploadTarget!}
				maxFiles={uploadTarget === 'cover' ? remainingCoversAllowed : 1}
				onClose={handleClose}
				replaceCover={replaceCover}
				onUpload={handleImageUploadSuccess}
			/>
		</div>
	);
}
