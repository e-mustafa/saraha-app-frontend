'use client';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/components/custom-ui/field';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { IResponse } from '@/shared/types/index';
import { apiClient } from '@/shared/utils/apiClient';
import { setFieldErrors } from '@/shared/utils/validations/field-errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { MailIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import {
	defaultValuesRChangeEmail,
	RequestChangeEmailInput,
	requestChangeEmailSchema,
} from '../schemas/request-change-email.schema';

export default function RequestChangeEmailForm() {
	const t = useTranslations();
	const router = useRouter();

	const form = useForm<RequestChangeEmailInput>({
		resolver: zodResolver(requestChangeEmailSchema),
		defaultValues: defaultValuesRChangeEmail,
		mode: 'all',
	});

	const { mutate, isPending } = useMutation({
		mutationFn: async (data: RequestChangeEmailInput) => {
			const response = await apiClient.post<IResponse>('/auth/request-change-email', data);
			console.log('RequestChangeEmail response', response);
			return response;
		},
		onSuccess: () => router.push(APP_ROUTES.profile),
		onError: (error: IResponse<RequestChangeEmailInput>) => {
			if (error?.errors) {
				setFieldErrors(error.errors, form);
			}
		},
	});

	// const onSubmit = async (data: RequestChangeEmailInput) => {
	// 	const result = await mutate(data);
	// 	console.log('forget password form result', result);

	// formResponse(result, form, {
	// 	onSuccess: () => {
	// 		router.push(APP_ROUTES.login);
	// 		// router.refresh();
	// 		// router.push(`${APP_ROUTES.verifyAccount}?email=${result.data.email}`);
	// 	},
	// });
	// };

	return (
		<form id='form-rhf' onSubmit={form.handleSubmit((data) => mutate(data))}>
			<FieldGroup>
				<Controller
					name='password'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor='form-rhf-password'>{t('forms.labels.password')}</FieldLabel>
							<div className='relative'>
								<div className='absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none'>
									<MailIcon className='w-4 h-4 text-gray-500' />
								</div>
								<Input
									{...field}
									id='form-rhf-password'
									aria-invalid={fieldState.invalid}
									placeholder={t('forms.placeholders.password')}
									autoComplete='current-password'
									autoFocus
									className='ps-10'
								/>
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
						</Field>
					)}
				/>

				<Controller
					name='newEmail'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor='form-rhf-newEmail'>{t('forms.labels.newEmail')}</FieldLabel>
							<div className='relative'>
								<div className='absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none'>
									<MailIcon className='w-4 h-4 text-gray-500' />
								</div>
								<Input
									{...field}
									id='form-rhf-newEmail'
									aria-invalid={fieldState.invalid}
									placeholder={t('forms.placeholders.email')}
									autoComplete='email'
									autoFocus
									className='ps-10'
								/>
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
						</Field>
					)}
				/>
			</FieldGroup>

			{/* <CardFooter></CardFooter> */}
			<Field orientation='horizontal' className='w-full pt-6'>
				<Button
					type='submit'
					disabled={form.formState.isSubmitting || isPending}
					variant='default'
					size='lg'
					form='form-rhf'
					className='flex-2'
				>
					{t('auth.forgotPassword.button')}
				</Button>
				
				<Button
					type='button'
					variant='outline'
					size='lg'
					onClick={() => router.push(APP_ROUTES.profile)}
					className='flex-1'
				>
					{t('common.cancel')}
				</Button>
			</Field>
		</form>
	);
}
