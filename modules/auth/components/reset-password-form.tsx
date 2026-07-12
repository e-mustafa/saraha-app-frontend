'use client';

import { useRouter } from '@/i18n/navigation';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/components/custom-ui/field';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { formResponse } from '@/shared/hooks/form-response';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { startTransition, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { resetPasswordAction } from '../actions';
import { defaultValuesResetPassword, ResetPasswordInput, resetPasswordSchema } from '../schemas/reset-password.schema';

export default function ResetPasswordForm() {
	const t = useTranslations();
	const searchParams = useSearchParams();
	const token = searchParams.get('token');

	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<ResetPasswordInput>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: defaultValuesResetPassword,
		mode: 'all',
	});

	useEffect(() => {
		if (token) {
			form.setValue('token', token);
		}
	}, [token, form]);

	const onSubmit = (data: ResetPasswordInput) => {
		startTransition(async () => {
			const result = await resetPasswordAction(data);

			formResponse(result, form, {
				onSuccess: () => {
					router.push(APP_ROUTES.login);
				},
			});
		});
	};

	return (
		<form id='form-reset-pass' onSubmit={form.handleSubmit(onSubmit)}>
			<FieldGroup>
				<Field orientation='vertical' className='gap-4 items-baseline'>
					<Controller
						name='password'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='form-reset-pass-password'>{t('forms.labels.password')}</FieldLabel>
								<div className='relative'>
									<div className='absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none'>
										<LockIcon className='w-4 h-4 text-gray-500' />
									</div>
									<Input
										type={showPassword ? 'text' : 'password'}
										{...field}
										id='form-reset-pass-password'
										aria-invalid={fieldState.invalid}
										placeholder='enter Your Password...'
										autoComplete='on'
										className='ps-10 pe-10'
									/>
									<div className='absolute inset-y-0 inset-e-0 flex items-center cursor-pointer'>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											onClick={() => setShowPassword(!showPassword)}
										>
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
								<FieldLabel htmlFor='form-reset-pass-confirmPassword'>
									{t('forms.labels.confirmPassword')}
								</FieldLabel>
								<div className='relative'>
									<div className='absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none'>
										<LockIcon className='w-4 h-4 text-gray-500' />
									</div>
									<Input
										type={showPassword ? 'text' : 'password'}
										{...field}
										id='form-reset-pass-confirmPassword'
										aria-invalid={fieldState.invalid}
										placeholder='confirm Your Password...'
										autoComplete='on'
										className='ps-10 pe-10'
									/>
									<div className='absolute inset-y-0 inset-e-0 flex items-center cursor-pointer'>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											onClick={() => setShowPassword(!showPassword)}
										>
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
							<Field data-invalid={fieldState.invalid}>
								{/* <FieldLabel htmlFor='form-reset-pass-logoutAll'>{t('auth.logoutAll')}</FieldLabel> */}
								<Checkbox id='form-reset-pass-logoutAll' checked={field.value} onCheckedChange={field.onChange} />
								<FieldLabel htmlFor='form-reset-pass-logoutAll' className='font-normal'>
									{t('auth.logoutAll')}
								</FieldLabel>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
							</Field>
						)}
					/>
				</Field>
			</FieldGroup>

			{/* <CardFooter></CardFooter> */}
			<Field orientation='horizontal' className='w-full pt-4'>
				<Button type='submit' variant='default' size='lg' form='form-reset-pass' className='flex-1'>
					{t('auth.resetPassword.button')}
				</Button>
			</Field>
		</form>
	);
}
