'use client';

import { useRouter } from '@/i18n/navigation';
import { Field, FieldError } from '@/shared/components/custom-ui/field';
import { Button } from '@/shared/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/shared/components/ui/input-otp';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { formResponse } from '@/shared/hooks/form-response';
import { apiClient } from '@/shared/utils/apiClient';
import { ApiError } from '@/shared/utils/app-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon, RefreshCwIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { verifyAccountAction } from '../actions';
import {
	defaultValuesVerifyAccount,
	ResendOtpInput,
	VerifyAccountInput,
	verifyAccountSchema,
} from '../schemas/verify-account.schema';
import { IResponse } from '../types';

export default function VerifyAccountForm() {
	const t = useTranslations();
	const searchParams = useSearchParams();
	const router = useRouter();
	const [isPendingVerify, startTransition] = useTransition(); // التتبع الصحيح لـ Server Action

	const form = useForm<VerifyAccountInput>({
		resolver: zodResolver(verifyAccountSchema),
		defaultValues: defaultValuesVerifyAccount,
		mode: 'all',
	});

	const { mutate: resendOtp, isPending: isResending } = useMutation<IResponse<null>, ApiError, ResendOtpInput>({
		mutationFn: async (variables) => {
			// تمرير الـ variables بشكل صريح وواضح للـ API
			return apiClient.post<IResponse<null>, ResendOtpInput>('/auth/resend-otp', variables);
		},
		onError: (error) => {
			console.error('Resend OTP error:', error);
			toast.error(error.message || 'Failed to resend OTP');
		},
		onSuccess: (res) => {
			toast.success(res.message || 'OTP resent successfully');
			router.push(APP_ROUTES.login);
		},
	});

	const onSubmit = async (data: VerifyAccountInput) => {
		startTransition(async () => {
			const email = searchParams.get('email') || '';
			console.log('Submitting verification for email:', email);
			const result = await verifyAccountAction({ ...data, email });

			formResponse(result, form, {
				onSuccess: () => {
					router.push(`${APP_ROUTES.login}`);
				},
			});
		});
	};

	return (
		<form id='form-verify-account' onSubmit={form.handleSubmit(onSubmit)}>
			<Controller
				name='otp'
				control={form.control}
				render={({ field, fieldState }) => (
					<Field data-invalid={fieldState.invalid}>
						{/* <div className='flex items-center justify-between'>
					<FieldLabel htmlFor='otp-verification'>Verification code</FieldLabel>
				</div> */}
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
						<input type='hidden' name='email' value={searchParams.get('email') || ''} />
					</Field>
				)}
			/>

			{/* <CardFooter></CardFooter> */}
			<Field orientation='responsive' className='w-full pt-6'>
				<Button
					type='button'
					variant='outline'
					size='lg'
					onClick={() => resendOtp({ email: searchParams.get('email') || '' })}
					disabled={isResending || isPendingVerify}
				>
					<RefreshCwIcon className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
					{t('auth.resendCode')}
				</Button>
				<Button type='submit' variant='default' size='lg' form='form-verify-account'>
					{isPendingVerify ? (
						<>
							{t('common.loading')}
							<Loader2Icon className='w-4 h-4 animate-spin ms-2' />
						</>
					) : (
						t('auth.verifyAccountButton')
					)}
				</Button>
			</Field>
		</form>
	);
}
