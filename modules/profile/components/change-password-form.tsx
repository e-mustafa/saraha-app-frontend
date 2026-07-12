'use client';

import { useRouter } from '@/i18n/navigation';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/components/custom-ui/field';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { apiClient } from '@/shared/utils/apiClient';
import { ApiError } from '@/shared/utils/app-error';
import { setFieldErrors } from '@/shared/utils/validations/field-errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { EyeIcon, EyeOffIcon, Loader2Icon, LockIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { startTransition, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IResponse } from '../../auth/types';
import { ChangePasswordInput, changePasswordSchema, defaultValuesChangePassword } from '../schemas/change-password.schema';

export default function ChangePasswordForm() {
	const t = useTranslations();
	const [showOldPassword, setShowOldPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	const form = useForm<ChangePasswordInput>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: defaultValuesChangePassword,
		mode: 'all',
	});

	const { mutate: changePasswordMutation, isPending } = useMutation<IResponse<null>, ApiError, ChangePasswordInput>({
		mutationFn: async (data) => {
			const { oldPassword, newPassword } = data;
			return apiClient.post<IResponse<null>>('/auth/change-password', {
				oldPassword,
				newPassword,
				isConfirmed: newPassword === form.watch('confirmPassword'),
			});
		},
		onSuccess: () => {
			// toast.success(res.message || t('auth.changePassword.success'));
			router.push(APP_ROUTES.login);
		},
		onError: (error) => {
			if (error.errors) {
				setFieldErrors(error.errors, form);
			}
			// toast.error(error.message || t('auth.changePassword.error'));
		},
	});

	const onSubmit = (data: ChangePasswordInput) => {
		startTransition(async () => {
			// const result = await changePasswordAction(data);
			changePasswordMutation(data);

			// formResponse(result, form, {
			// 	onSuccess: () => {
			// 		router.push(APP_ROUTES.login);
			// 	},
			// });
		});
	};

	return (
		<form id='form-register' onSubmit={form.handleSubmit(onSubmit)}>
			<FieldGroup>
				{/* <Field orientation='vertical' className='gap-4 items-baseline'> */}
				<Controller
					name='oldPassword'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor='form-register-old-password'>{t('forms.labels.oldPassword')}</FieldLabel>
							<div className='relative'>
								<div className='absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none'>
									<LockIcon className='w-4 h-4 text-gray-500' />
								</div>
								<Input
									type={showOldPassword ? 'text' : 'password'}
									{...field}
									id='form-register-old-password'
									aria-invalid={fieldState.invalid}
									placeholder={t('forms.placeholders.oldPassword')}
									autoComplete='on'
									className='ps-10 pe-10'
								/>
								<div className='absolute inset-y-0 inset-e-0 flex items-center cursor-pointer'>
									<Button
										type='button'
										variant='ghost'
										size='icon'
										onClick={() => setShowOldPassword(!showOldPassword)}
									>
										{showOldPassword ? (
											<EyeOffIcon className='w-4 h-4 text-gray-500' />
										) : (
											<EyeIcon className='w-4 h-4 text-gray-500' />
										)}
									</Button>
								</div>
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
						</Field>
					)}
				/>
				<Controller
					name='newPassword'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor='form-register-password'>{t('forms.labels.newPassword')}</FieldLabel>
							<div className='relative'>
								<div className='absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none'>
									<LockIcon className='w-4 h-4 text-gray-500' />
								</div>
								<Input
									type={showPassword ? 'text' : 'password'}
									{...field}
									id='form-register-password'
									aria-invalid={fieldState.invalid}
									placeholder={t('forms.placeholders.newPassword')}
									autoComplete='on'
									className='ps-10 pe-10'
								/>
								<div className='absolute inset-y-0 inset-e-0 flex items-center cursor-pointer'>
									<Button type='button' variant='ghost' size='icon' onClick={() => setShowPassword(!showPassword)}>
										{showPassword ? (
											<EyeOffIcon className='w-4 h-4 text-gray-500' />
										) : (
											<EyeIcon className='w-4 h-4 text-gray-500' />
										)}
									</Button>
								</div>
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
						</Field>
					)}
				/>
				<Controller
					name='confirmPassword'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor='form-register-confirmPassword'>{t('forms.labels.confirmPassword')}</FieldLabel>
							<div className='relative'>
								<div className='absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none'>
									<LockIcon className='w-4 h-4 text-gray-500' />
								</div>
								<Input
									type={showPassword ? 'text' : 'password'}
									{...field}
									id='form-register-confirmPassword'
									aria-invalid={fieldState.invalid}
									placeholder={t('forms.placeholders.confirmPassword')}
									autoComplete='on'
									className='ps-10 pe-10'
								/>
								<div className='absolute inset-y-0 inset-e-0 flex items-center cursor-pointer'>
									<Button type='button' variant='ghost' size='icon' onClick={() => setShowPassword(!showPassword)}>
										{showPassword ? (
											<EyeOffIcon className='w-4 h-4 text-gray-500' />
										) : (
											<EyeIcon className='w-4 h-4 text-gray-500' />
										)}
									</Button>
								</div>
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
						</Field>
					)}
				/>

				<Controller
					name='logoutAll'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid} orientation='horizontal'>
							{/* <FieldLabel htmlFor='form-reset-pass-logoutAll'>{t('auth.logoutAll')}</FieldLabel> */}
							<Checkbox id='form-reset-pass-logoutAll' checked={field.value} onCheckedChange={field.onChange} />
							<FieldLabel htmlFor='form-reset-pass-logoutAll' className='font-normal'>
								{t('auth.logoutAll')}
							</FieldLabel>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
						</Field>
					)}
				/>
				{/* </Field> */}
			</FieldGroup>

			{/* <CardFooter></CardFooter> */}
			<Field orientation='horizontal' className='w-full py-4'>
				<Button type='submit' variant='default' size='lg' form='form-register' className='flex-2' disabled={isPending}>
					{isPending ? (
						<>
							{t('common.loading')}
							<Loader2Icon className='w-4 h-4 animate-spin' />
						</>
					) : (
						t('auth.changePassword.button')
					)}
				</Button>

				<Button
					type='button'
					variant='outline'
					size='lg'
					className='flex-1'
					onClick={() => router.push(APP_ROUTES.profile)}
				>
					{t('common.cancel')}
				</Button>
			</Field>
		</form>
	);
}
