'use client';

import { Button } from '@/shared/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/shared/components/ui/dialog';
import { IResponse } from '@/shared/types/index';
import { apiClient } from '@/shared/utils/apiClient';
import { cn } from '@/shared/utils/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImagePlusIcon, Loader2, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { UserProfile } from '../types/database';

interface SingleImageUploadModalProps {
	isOpen: boolean;
	onClose: () => void;
	onUpload: (urls: string | string[]) => void;
	mode: 'avatar' | 'cover';
	maxFiles?: number; // ✅ حل مشكلة الخطأ المذكور بإضافة الخاصية هنا كاختيارية
}

export default function SingleImageUploadModal({ isOpen, onClose, onUpload, mode }: SingleImageUploadModalProps) {
	const t = useTranslations();
	const locale = useLocale();
	const queryClient = useQueryClient();
	const filePickerRef = useRef<HTMLInputElement>(null);

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	const handleClose = () => {
		if (isPending) return;

		setSelectedFile(null);
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setPreviewUrl(null);
		if (filePickerRef.current) filePickerRef.current.value = '';

		onClose();
	};

	const { mutate: uploadImage, isPending } = useMutation({
		mutationKey: ['profile', mode],
		mutationFn: async (file: File) => {
			const formData = new FormData();
			const fieldName = mode === 'avatar' ? 'avatar' : 'covers';
			formData.append(fieldName, file);

			const response = await apiClient.patch<IResponse<Partial<UserProfile>>>(
				`/users/${mode === 'avatar' ? 'profile-avatar' : 'profile-covers'}`,
				formData,
			);

			return response;
		},
		onSuccess: (res: IResponse<Partial<UserProfile>>) => {
			queryClient.setQueryData(['profile'], (oldData: UserProfile | undefined) => {
				// if (!oldData) return oldData;

				const newData = { ...oldData };

				if (res.data) {
					Object.entries(res.data).forEach(([key, value]) => {
						if (value !== undefined && value !== null) {
							newData[key as keyof UserProfile] = value;
						}
					});
				}

				return newData;
			});

			if (mode === 'avatar') {
				onUpload((res?.data as Partial<UserProfile>).avatar || '');
			} else {
				onUpload((res?.data as Partial<UserProfile>).covers || []);
			}

			setSelectedFile(null);
			if (previewUrl) URL.revokeObjectURL(previewUrl);
			setPreviewUrl(null);

			onClose();
		},
		// onError: (error: unknown) => {
		// 	console.error('Upload Error:', error);
		// 	const errorMessage = (error as Error)?.message || t('forms.upload.uploadFailed');
		// 	toast.error(errorMessage);
		// },
	});

	useEffect(() => {
		return () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
		};
	}, [previewUrl]);

	const handleFileSelection = (files: File[]) => {
		const file = files[0];
		if (!file) return;

		if (!file.type.startsWith('image/')) {
			toast.error(t('errors.invalidType'));
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			toast.error(t('errors.fileTooLarge'));
			return;
		}

		if (previewUrl) URL.revokeObjectURL(previewUrl);

		setSelectedFile(file);
		setPreviewUrl(URL.createObjectURL(file));
	};

	const handleRemoveSelected = (e: React.MouseEvent) => {
		e.stopPropagation();
		setSelectedFile(null);
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setPreviewUrl(null);
		if (filePickerRef.current) filePickerRef.current.value = '';
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (selectedFile) {
			uploadImage(selectedFile);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent dir={locale === 'ar' ? 'rtl' : 'ltr'} className='sm:max-w-md bg-card-glass backdrop-blur-lg'>
				<DialogHeader>
					<DialogTitle>{mode === 'avatar' ? t('forms.upload.editAvatar') : t('forms.upload.editCover')}</DialogTitle>
					<DialogDescription>
						{mode === 'avatar' ? t('forms.upload.avatarSingleDesc') : t('forms.upload.coverSingleDesc')}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className='space-y-4'>
					{!previewUrl ? (
						<div
							className={`mt-2 flex flex-col items-center justify-center rounded-xl border border-dashed p-8 transition-colors cursor-pointer ${
								isDragging ? 'border-brand-primary bg-brand-primary/5' : 'border-input hover:bg-accent/5'
							} ${mode === 'avatar' ? 'aspect-square max-w-[220px] mx-auto' : 'aspect-3/1 w-full'}`}
							onDragOver={(e) => {
								e.preventDefault();
								if (!isPending) setIsDragging(true);
							}}
							onDragLeave={() => setIsDragging(false)}
							onDrop={(e) => {
								e.preventDefault();
								setIsDragging(false);
								if (!isPending) handleFileSelection(Array.from(e.dataTransfer.files));
							}}
							onClick={() => !isPending && filePickerRef.current?.click()}
						>
							<ImagePlusIcon className='h-8 w-8 mb-2 text-brand-primary' />
							<div className='text-xs text-muted-foreground text-center font-medium'>
								{t('forms.upload.clickOrDrag')}
							</div>
							<input
								ref={filePickerRef}
								type='file'
								accept='image/*'
								className='sr-only'
								disabled={isPending}
								onChange={(e) => handleFileSelection(Array.from(e.target.files || []))}
							/>
						</div>
					) : (
						<div
							className={cn(
								'relative mt-2 border rounded-xl overflow-hidden bg-muted group flex items-center justify-center mx-auto',
								mode === 'avatar' ? 'aspect-square max-w-[220px] mx-auto' : 'aspect-3/1 w-full',
							)}
						>
							<div
								className={`relative w-full ${
									mode === 'avatar' ? 'aspect-square max-w-[220px] rounded-xl' : 'aspect-3/1 w-full'
								}`}
							>
								<img
									src={previewUrl}
									alt='Preview'
									className={cn('object-cover w-full h-full', mode === 'avatar' ? 'aspect-square' : 'aspect-video')}
								/>
							</div>

							{!isPending && (
								<Button
									type='button'
									variant='destructive'
									size='icon'
									className='absolute top-2 right-2 h-7 w-7 rounded-full shadow-md opacity-90 hover:opacity-100'
									onClick={handleRemoveSelected}
								>
									<X className='h-4 w-4' />
								</Button>
							)}
						</div>
					)}

					<p className='text-xs text-muted-foreground text-center'>{t('forms.upload.allowedTypes')}</p>

					<DialogFooter dir={locale === 'ar' ? 'rtl' : 'ltr'} className='flex gap-4 mt-4'>
						<Button
							type='button'
							variant='outline'
							disabled={isPending}
							onClick={handleClose}
							className='w-full sm:w-auto'
						>
							{t('common.cancel')}
						</Button>

						<Button type='submit' disabled={!selectedFile || isPending} className='w-full sm:w-auto min-w-[120px]'>
							{isPending ? (
								<>
									<Loader2 className='mr-2 ml-2 h-4 w-4 animate-spin' />
									{t('forms.upload.uploading')}
								</>
							) : (
								t('common.saveChanges')
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
