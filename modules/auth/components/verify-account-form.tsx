'use client';

import { useRouter } from '@/i18n/navigation';
import { Field, FieldError } from '@/shared/components/custom-ui/field';
import { Button } from '@/shared/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/shared/components/ui/input-otp';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { apiClient } from '@/shared/utils/apiClient';
import { ApiError } from '@/shared/utils/app-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2Icon, RefreshCwIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '../hooks/use-auth';
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
	const queryClient = useQueryClient();
	const emailFromUrl = searchParams.get('email') || '';

	const { user } = useAuth();

	const form = useForm<VerifyAccountInput>({
		resolver: zodResolver(verifyAccountSchema),
		defaultValues: defaultValuesVerifyAccount,
		mode: 'all',
	});

	// Sync email from URL search params or authenticated user session into React Hook Form
	useEffect(() => {
		if (emailFromUrl) {
			form.setValue('email', emailFromUrl);
		} else if (user?.email) {
			form.setValue('email', user.email);
		}
	}, [emailFromUrl, user, form]);

	const { mutate: verifyAccount, isPending: isVerifying } = useMutation<IResponse<null>, ApiError, VerifyAccountInput>({
		mutationFn: async (data) => {
			return apiClient.post<IResponse<null>>('/auth/verify-account', data);
		},
		onError: (error) => {
			console.error('Verify account error:', error);
			// toast.error(error.message || 'Failed to verify account');
		},
		onSuccess: () => {
			// toast.success(res.message || 'Account verified successfully');
			queryClient.invalidateQueries({ queryKey: ['profile', 'authUser'] });
			if (user?.email) {
				router.back();
			} else {
				router.push(APP_ROUTES.login);
			}
		},
	});

	const { mutate: resendOtp, isPending: isResending } = useMutation<IResponse<null>, ApiError, ResendOtpInput>({
		mutationFn: async () => {
			const targetEmail = form.getValues('email') || emailFromUrl || user?.email || '';
			return apiClient.post<IResponse<null>, ResendOtpInput>('/auth/resend-otp', { email: targetEmail });
		},
		onError: (error) => {
			console.error('Resend OTP error:', error);
		},
		onSuccess: (res) => {
			toast.success(res.message || 'OTP resent successfully');
		},
	});

	const onSubmit = async (data: VerifyAccountInput) => {
		// Ensure email is attached from the form state or fallbacks
		const targetEmail = data.email || emailFromUrl || user?.email || '';
		verifyAccount({ ...data, email: targetEmail });
	};

	return (
		<form id='form-verify-account' onSubmit={form.handleSubmit(onSubmit)}>
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
			<div className='flex pt-4 justify-end'>
				<Button
					type='button'
					variant='outline'
					size='sm'
					onClick={() => resendOtp({ email: form.getValues('email') })}
					disabled={isResending || isVerifying}
					className='w-fit'
				>
					<RefreshCwIcon className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
					{t('auth.steps.resendCode')}
				</Button>
			</div>
			<Field orientation='horizontal' className='w-full pt-6'>
				<Button type='submit' variant='default' size='lg' form='form-verify-account' className='flex-2'>
					{isVerifying ? (
						<>
							{t('common.loading')}
							<Loader2Icon className='w-4 h-4 animate-spin ms-2' />
						</>
					) : (
						t('auth.steps.verifyButton')
					)}
				</Button>
				<Button type='button' variant='outline' size='lg' onClick={() => router.back()} className='px-10 flex-1'>
					{t('common.cancel') || 'Cancel'}
				</Button>
			</Field>
		</form>
	);
}
