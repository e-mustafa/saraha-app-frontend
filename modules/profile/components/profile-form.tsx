'use client';

import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
	FieldSet,
	FieldTitle,
} from '@/shared/components/custom-ui/field';
import { DatePicker } from '@/shared/components/date-picker';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Textarea } from '@/shared/components/ui/textarea';
import { IResponse } from '@/shared/types/index';
import { apiClient } from '@/shared/utils/apiClient';
import { setFieldErrors } from '@/shared/utils/validations/field-errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarIcon, PhoneIcon, User2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { defaultValuesProfile, ProfileInput, profileSchema } from '../schemas/profile.schema';

interface ProfileFormProps {
	initialData?: ProfileInput;
	onClose?: () => void;
	onSuccess?: () => void;
}

export default function ProfileForm({ initialData, onSuccess, onClose }: ProfileFormProps) {
	const t = useTranslations();
	const queryClient = useQueryClient();

	// const formattedInitialValues: ProfileInput = {
	// 	...defaultValuesProfile,
	// 	...initialData,
	// 	// تحويل التاريخ النصي القادم من الباك إند إلى كائن Date حقيقي فوراً
	// 	birthdate: initialData?.birthdate ? new Date(initialData.birthdate) : undefined,
	// 	// التأكد من أن الجنس رقمي دائماً
	// 	gender: initialData?.gender !== undefined ? Number(initialData.gender) : 0,
	// };

	const form = useForm<ProfileInput>({
		resolver: zodResolver(profileSchema) as Resolver<ProfileInput>,
		values: initialData
			? Object.keys(defaultValuesProfile).reduce((acc, key) => {
					(acc as Record<string, unknown>)[key] =
						initialData?.[key as keyof ProfileInput] ?? defaultValuesProfile[key as keyof ProfileInput];
					return acc;
				}, {} as ProfileInput)
			: defaultValuesProfile, // formattedInitialValues,
		defaultValues: defaultValuesProfile,
		mode: 'all',
	});

	const { mutate, isPending } = useMutation({
		mutationKey: ['profile'],
		mutationFn: async (data: ProfileInput) => {
			const response = await apiClient.patch<IResponse<ProfileInput>>(`/users/profile`, data);
			return response;
		},

		onSuccess: (res) => {
			queryClient.setQueryData(['profile'], () => {
				return res.data;
			});
			if (res.success) onSuccess?.();
		},
		onError: (error: IResponse<ProfileInput>) => {
			if (error?.errors?.body) setFieldErrors(error?.errors?.body, form);
		},
	});

	// const { mutate: checkUsername, isPending: isCheckingUsername } = useMutation({
	// 	mutationKey: ['profile'],
	// 	mutationFn: async (data: ProfileInput) => {
	// 		const response = await apiClient.patch<IResponse<ProfileInput>>(`${configEnv.apiBaseUrl}/users/profile`, data);
	// 		return response;
	// 	},
	// 	onError: (error: IResponse<ProfileInput>) => {
	// 		if (error?.errors?.body) setFieldErrors(error?.errors?.body, form);
	// 	},
	// });

	// const onSubmit = (data: ProfileInput) => {
	// 	startTransition(async () => {
	// 		const result = await updateProfileAction(data);
	// 		formResponse(result, form, {
	// 			onSuccess: () => {
	// 				// setIsEditMode(false);
	// 				onSuccess?.();
	// 			},
	// 		});
	// 	});
	// };

	const onSubmit = (data: ProfileInput) => {
		if (!form.formState.isDirty) {
			// onClose?.();
		}
		mutate(data);
	};

	return (
		<form id='form-profile-update' onSubmit={form.handleSubmit(onSubmit)} className='animate-fadeIn'>
			<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
				<Controller
					name='firstName'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid} className='flex-1'>
							<FieldLabel htmlFor='profile-firstName'>{t('forms.labels.firstName')}</FieldLabel>
							<Input
								{...field}
								id='profile-firstName'
								aria-invalid={fieldState.invalid}
								placeholder={t('forms.placeholders.firstName')}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
						</Field>
					)}
				/>

				<Controller
					name='lastName'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid} className='flex-1'>
							<FieldLabel htmlFor='profile-lastName'>{t('forms.labels.lastName')}</FieldLabel>
							<Input
								{...field}
								id='profile-lastName'
								aria-invalid={fieldState.invalid}
								placeholder={t('forms.placeholders.lastName')}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
						</Field>
					)}
				/>

				<Controller
					name='username'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor='profile-username'>{t('forms.labels.username')}</FieldLabel>
							<div className='relative'>
								<div className='absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none'>
									<User2Icon className='w-4 h-4 text-muted-foreground' />
								</div>
								<Input
									{...field}
									id='profile-username'
									aria-invalid={fieldState.invalid}
									className='ps-10'
									placeholder={t('forms.placeholders.username')}
								/>
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
						</Field>
					)}
				/>

				{/* <Controller
					name='email'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid} className='flex-1'>
							<FieldLabel htmlFor='profile-email'>{t('forms.labels.email')}</FieldLabel>
							<div className='relative'>
								<div className='absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none'>
									<MailIcon className='w-4 h-4 text-muted-foreground' />
								</div>
								<Input
									{...field}
									type='email'
									id='profile-email'
									aria-invalid={fieldState.invalid}
									className='ps-10'
									placeholder={t('forms.placeholders.email')}
								/>
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
						</Field>
					)}
				/> */}

				<Controller
					name='phone'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid} className='flex-1'>
							<FieldLabel htmlFor='profile-phone'>{t('forms.labels.phone')}</FieldLabel>
							<div className='relative'>
								<div className='absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none'>
									<PhoneIcon className='w-4 h-4 text-muted-foreground' />
								</div>
								<Input
									{...field}
									id='profile-phone'
									aria-invalid={fieldState.invalid}
									className='ps-10'
									placeholder={t('forms.placeholders.phone')}
								/>
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
						</Field>
					)}
				/>

				{/* تاريخ الميلاد */}
				<Controller
					name='birthdate'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor='profile-birthdate'>{t('forms.labels.birthdate')}</FieldLabel>
							<div className='relative'>
								<div className='absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none'>
									<CalendarIcon className='w-4 h-4 text-muted-foreground' />
								</div>
								<DatePicker value={field.value} onChange={field.onChange} />
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
						</Field>
					)}
				/>

				<Controller
					name='gender'
					control={form.control}
					render={({ field, fieldState }) => (
						<FieldSet>
							{/* <FieldLegend className='text-sm'>Gender</FieldLegend> */}
							<FieldLabel htmlFor='form-register-confirmPassword'>{t('forms.labels.gender')}</FieldLabel>

							<RadioGroup
								className='flex'
								name={field.name}
								// تحويل آمن: إذا كانت القيمة undefined نمرر نصاً فارغاً
								value={field.value !== undefined ? String(field.value) : ''}
								// نلتقط النص القادم من المكون ونحوله فوراً إلى رقم لـ React Hook Form
								onValueChange={(val) => field.onChange(Number(val))}
								// value={String(field.value)}
								// onValueChange={field.onChange}
							>
								<FieldLabel htmlFor={`form-rhf-radiogroup-male`}>
									<Field orientation='horizontal' data-invalid={fieldState.invalid}>
										<FieldContent>
											<FieldTitle>{t('forms.labels.male')}</FieldTitle>
											{/* <FieldDescription>Male</FieldDescription> */}
										</FieldContent>
										<RadioGroupItem value='0' id={`form-rhf-radiogroup-male`} aria-invalid={fieldState.invalid} />
									</Field>
								</FieldLabel>
								<FieldLabel htmlFor={`form-rhf-radiogroup-female`}>
									<Field orientation='horizontal' data-invalid={fieldState.invalid}>
										<FieldContent>
											<FieldTitle>{t('forms.labels.female')}</FieldTitle>
											{/* <FieldDescription>Female</FieldDescription> */}
										</FieldContent>
										<RadioGroupItem
											value='1'
											id={`form-rhf-radiogroup-female`}
											aria-invalid={fieldState.invalid}
										/>
									</Field>
								</FieldLabel>
							</RadioGroup>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
						</FieldSet>
					)}
				/>

				<Controller
					name='bio'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor='profile-bio'>{t('forms.labels.bio') || 'Bio'}</FieldLabel>
							<Textarea
								{...field}
								id='profile-bio'
								rows={4}
								placeholder={t('forms.placeholders.bio')}
								className='resize-none'
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
						</Field>
					)}
				/>

				<Controller
					name='allowAnonymousUsers'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field orientation='vertical' data-invalid={fieldState.invalid}>
							<Field orientation='horizontal'>
								<Checkbox
									id='form-rhf-checkbox-allowAnonymousUsers'
									name='allowAnonymousUsers'
									aria-invalid={fieldState.invalid}
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
								<FieldLabel htmlFor='form-rhf-checkbox-allowAnonymousUsers' className='font-normal'>
									{t('forms.labels.allowAnonymousUsers')}
								</FieldLabel>
							</Field>
							<FieldDescription className='text-start'>
								{t('forms.placeholders.allowAnonymousUsers')}
							</FieldDescription>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
						</Field>
					)}
				/>
			</div>

			<div className='flex gap-4 mt-4 justify-center'>
				<Button
					type='submit'
					size='lg'
					form='form-profile-update'
					disabled={isPending}
					className='px-10'
					// className='bg-brand-primary flex hover:bg-brand-primary/90 text-white transition-all shadow-md'
				>
					{isPending ? t('common.loading') : t('common.saveChanges')}
				</Button>

				<Button
					type='button'
					variant='outline'
					size='lg'
					onClick={() => {
						form.reset(initialData);
						onClose?.();
					}}
					className='px-10'
					// className='bg-brand-primary flex hover:bg-brand-primary/90 text-white transition-all shadow-md'
				>
					{t('common.cancel') || 'Cancel'}
				</Button>
			</div>
		</form>
	);
}
