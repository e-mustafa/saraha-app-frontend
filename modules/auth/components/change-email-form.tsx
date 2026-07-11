'use client';

import { Field, FieldError } from '@/shared/components/custom-ui/field';
import { Button } from '@/shared/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/shared/components/ui/input-otp';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { IResponse } from '@/shared/types/index';
import { apiClient } from '@/shared/utils/apiClient';
import { setFieldErrors } from '@/shared/utils/validations/field-errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { ChangeEmailInput, changeEmailSchema, defaultValuesChangeEmail } from '../schemas/change-email.schema';

export default function ChangeEmailForm() {
	const t = useTranslations();
	const router = useRouter();

	const form = useForm<ChangeEmailInput>({
		resolver: zodResolver(changeEmailSchema),
		defaultValues: defaultValuesChangeEmail,
		mode: 'all',
	});

	const { mutate, isPending } = useMutation({
		mutationFn: async (data: ChangeEmailInput) => {
			const response = await apiClient.patch<IResponse>('/auth/change-email', data);
			console.log('ChangeEmail response', response);
			return response;
		},
		onSuccess: () => router.push(APP_ROUTES.profile),
		onError: (error: IResponse<ChangeEmailInput>) => {
			if (error?.errors) {
				setFieldErrors(error.errors, form);
			}
		},
	});

	return (
		<form id='form-rhf' onSubmit={form.handleSubmit((data) => mutate(data))}>
			<Controller
				name='otp'
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						<div dir='ltr'>
							<InputOTP
								{...field}
								data-invalid={fieldState.invalid}
								autoFocus
								containerClassName='justify-center'
								maxLength={6}
								id='otp-verification'
							>
								<InputOTPGroup
									dir='ltr'
									className='*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl'
								>
									<InputOTPSlot index={0} />
									<InputOTPSlot index={1} />
									<InputOTPSlot index={2} />
								</InputOTPGroup>
								<InputOTPSeparator className='mx-2' />
								<InputOTPGroup
									dir='ltr'
									className='*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl'
								>
									<InputOTPSlot index={3} />
									<InputOTPSlot index={4} />
									<InputOTPSlot index={5} />
								</InputOTPGroup>
							</InputOTP>
						</div>
						{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
					</Field>
				)}
			/>

			<Button
				type='submit'
				disabled={form.formState.isSubmitting || isPending}
				variant='default'
				size='lg'
				form='form-rhf'
				className='flex-1'
			>
				{t('auth.changeEmail.button')}
			</Button>
		</form>
	);
}
