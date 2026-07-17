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
import { appConfig } from '@/shared/config/app-configs';
import { IResponse } from '@/shared/types/index';
import { apiClient } from '@/shared/utils/apiClient';
import { cn } from '@/shared/utils/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImagePlusIcon, Loader2, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { UserImage, UserProfile } from '../types/database';

interface SingleImageUploadModalProps {
	isOpen: boolean;
	onClose: () => void;
	onUpload: (urls: UserImage | UserImage[]) => void;
	mode: 'avatar' | 'cover' | 'replace';
	replaceCover: string | null;
	maxFiles?: number;
}

export default function SingleImageUploadModal({
	isOpen,
	onClose,
	onUpload,
	mode,
	replaceCover = null,
	maxFiles = mode === 'cover' ? appConfig.user.coversMaxCount || 2 : 1, // Defaulting to 2 for covers, 1 for avatar
}: SingleImageUploadModalProps) {
	const t = useTranslations();
	const locale = useLocale();
	const queryClient = useQueryClient();
	const filePickerRef = useRef<HTMLInputElement>(null);

	// Supporting multiple files and preview URLs
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [previewUrls, setPreviewUrls] = useState<string[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});

	const handleClose = () => {
		if (isPending) return;

		// Clean up all memory URLs to avoid memory leaks
		previewUrls.forEach((url) => URL.revokeObjectURL(url));
		setSelectedFiles([]);
		setPreviewUrls([]);
		if (filePickerRef.current) filePickerRef.current.value = '';

		onClose();
	};

	const { mutate: uploadImages, isPending } = useMutation({
		mutationKey: ['profile', mode],
		mutationFn: async (files: File[]) => {
			const formData = new FormData();
			const fieldName = mode === 'avatar' ? 'avatar' : mode === 'cover' ? 'covers' : 'cover';

			// Append each selected file to the FormData payload
			files.forEach((file) => {
				formData.append(fieldName, file);
			});

			let response;
			if (mode === 'avatar') {
				response = await apiClient.patch<IResponse<Partial<UserProfile>>>(`/users/profile-avatar`, formData);
			} else if (mode === 'cover') {
				response = await apiClient.post<IResponse<Partial<UserProfile>>>(`/users/profile-covers`, formData);
			} else {
				if (replaceCover) formData.append('id', replaceCover);
				response = await apiClient.patch<IResponse<Partial<UserProfile>>>(`/users/profile-covers`, formData);
			}

			return response;
		},
		onSuccess: (res: IResponse<Partial<UserProfile>>) => {
			const profileData = Array.isArray(res.data) ? res.data[0] : res.data;

			queryClient.setQueryData(['profile'], (oldData: UserProfile | undefined) => {
				if (!oldData) return undefined;

				// Construct clean dynamic updates securely using Record type instead of any
				const cleanUpdates: Partial<UserProfile> = {};

				if (profileData) {
					(Object.keys(profileData) as Array<keyof UserProfile>).forEach((key) => {
						const value = profileData[key];
						if (value !== undefined && value !== null) {
							// Safely map index keys using standard TS unknown record format
							(cleanUpdates as Record<string, unknown>)[key as string] = value;
						}
					});
				}

				// Safely merge partial profile data back into query cache state
				return {
					...oldData,
					...cleanUpdates,
				} as UserProfile;
			});

			if (mode === 'avatar') {
				onUpload(profileData?.avatar || ({} as UserImage));
			} else {
				onUpload(profileData?.covers || []);
			}

			// Clean up states upon success
			setSelectedFiles([]);
			previewUrls.forEach((url) => URL.revokeObjectURL(url));
			setPreviewUrls([]);

			onClose();
		},
		onError: (error: IResponse) => {
			console.log('error', error);
			if (error.errors?.body) setFormErrors(error.errors?.body || {});
			console.log('formErrors', formErrors);
		},
	});

	// Cleanup object URLs on unmount or preview changes
	useEffect(() => {
		return () => {
			previewUrls.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [previewUrls]);

	useEffect(() => {
		if (formErrors) {
			const timer = setTimeout(() => setFormErrors({}), 5000);
			return () => clearTimeout(timer);
		}
	}, [formErrors]);

	const handleFileSelection = (files: File[]) => {
		console.log('files', files);
		console.log('maxFiles', maxFiles);
		console.log('replaceCover', replaceCover);
		const validFiles: File[] = [];
		const newPreviewUrls: string[] = [];

		// Slice files array based on the configured maximum allowed files limit
		const filesToProcess = files.slice(0, maxFiles);

		for (const file of filesToProcess) {
			if (!file.type.startsWith('image/')) {
				toast.error(t('forms.upload.invalidType'));
				continue;
			}

			if (file.size > appConfig.user.coversMaxSize) {
				toast.error(t('forms.upload.fileTooLarge', { maxSize: appConfig.user.coversMaxSize / 1024 / 1024 }));
				continue;
			}

			validFiles.push(file);
			newPreviewUrls.push(URL.createObjectURL(file));
		}

		if (validFiles.length > 0) {
			// Revoke previous URLs before setting new ones to prevent leaks
			previewUrls.forEach((url) => URL.revokeObjectURL(url));

			setSelectedFiles(validFiles);
			setPreviewUrls(newPreviewUrls);
		}

		console.log('validFiles', validFiles);
		console.log('newPreviewUrls', newPreviewUrls);
	};

	const handleRemoveSelected = (indexToRemove: number, e: React.MouseEvent) => {
		e.stopPropagation();

		// Revoke specific URL to free browser memory
		URL.revokeObjectURL(previewUrls[indexToRemove]);

		const updatedFiles = selectedFiles.filter((_, idx) => idx !== indexToRemove);
		const updatedPreviews = previewUrls.filter((_, idx) => idx !== indexToRemove);

		setSelectedFiles(updatedFiles);
		setPreviewUrls(updatedPreviews);

		if (updatedFiles.length === 0 && filePickerRef.current) {
			filePickerRef.current.value = '';
		}
	};

	const handleSubmit = (e: React.SubmitEvent) => {
		e.preventDefault();
		if (selectedFiles.length > 0) {
			uploadImages(selectedFiles);
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
					{previewUrls.length === 0 ? (
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
								multiple={maxFiles > 1}
								maxLength={maxFiles}
								className='sr-only'
								disabled={isPending}
								onChange={(e) => handleFileSelection(Array.from(e.target.files || []))}
							/>
						</div>
					) : (
						/* Flexible Grid Layout to handle single and multiple image previews */
						// <div className={cn('grid gap-2 w-full mt-2', previewUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1')}>
						<div className='flex flex-col gap-2 w-full mt-2'>
							{previewUrls.map((url, index) => (
								<div
									key={url}
									className={cn(
										'relative border rounded-xl overflow-hidden bg-muted group flex items-center justify-center mx-auto w-full',
										mode === 'avatar' ? 'aspect-square max-w-[220px]' : 'aspect-3/1',
									)}
								>
									<img src={url} alt={`Preview ${index + 1}`} className='object-cover w-full h-full' />

									{!isPending && (
										<Button
											type='button'
											variant='destructive'
											size='icon'
											className='absolute top-2 right-2 h-7 w-7 rounded-full shadow-md opacity-90 hover:opacity-100'
											onClick={(e) => handleRemoveSelected(index, e)}
										>
											<X className='h-4 w-4' />
										</Button>
									)}
								</div>
							))}
						</div>
					)}

					<p className='text-xs text-muted-foreground text-center'>{t('forms.upload.allowedTypes')}</p>
					{formErrors && (
						<div className='text-xs text-destructive font-medium animate-in animate-fade-in peer-first:t-3'>
							{Object.values(formErrors).join('\n')}
						</div>
					)}

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

						<Button
							type='submit'
							disabled={selectedFiles.length === 0 || isPending}
							className='w-full sm:w-auto min-w-[120px]'
						>
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
