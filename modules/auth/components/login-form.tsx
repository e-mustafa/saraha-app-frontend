'use client';

import { Link, useRouter } from '@/i18n/navigation';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/components/custom-ui/field';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { formResponse } from '@/shared/hooks/form-response';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { startTransition, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { loginAction } from '../actions';
import { defaultValuesLogin, LoginInput, loginSchema } from '../schemas/login.schema';

export default function LoginForm() {
	const [showPassword, setShowPassword] = useState(false);
	const t = useTranslations();
	const router = useRouter();

	// z.config({ localeError: getZodErrorMap(t) });

	const form = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		defaultValues: defaultValuesLogin,
		mode: 'all',
	});

	const onSubmit = (data: LoginInput) => {
		startTransition(async () => {
			const result = await loginAction(data);
			console.log('login form result', result);

			formResponse(result, form, {
				onSuccess: () => {
					router.push(APP_ROUTES.messages);
					router.refresh();
					// router.push(`${APP_ROUTES.verifyAccount}?email=${result.data.email}`);
				},
			});
		});
	};

	console.log('window.location', window.location);

	return (
		<form id='form-rhf' onSubmit={form.handleSubmit(onSubmit)}>
			<FieldGroup>
				<Controller
					name='email'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor='form-rhf-email'>{t('forms.labels.email')}</FieldLabel>
							<div className='relative'>
								<div className='absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none'>
									<MailIcon className='w-4 h-4 text-gray-500' />
								</div>
								<Input
									{...field}
									id='form-rhf-email'
									aria-invalid={fieldState.invalid}
									placeholder={t('forms.placeholders.email')}
									autoComplete='on'
									autoFocus
									className='ps-10'
								/>
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
						</Field>
					)}
				/>
				<Controller
					name='password'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor='form-rhf-password'>{t('forms.labels.password')}</FieldLabel>
							<div className='relative'>
								<div className='absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none'>
									<LockIcon className='w-4 h-4 text-gray-500' />
								</div>
								<Input
									type={showPassword ? 'text' : 'password'}
									{...field}
									id='form-rhf-password'
									aria-invalid={fieldState.invalid}
									placeholder={t('forms.placeholders.password')}
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
				<Field orientation='horizontal'>
					<Controller
						name='rememberMe'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field orientation='horizontal' data-invalid={fieldState.invalid}>
								<Checkbox
									id='form-rhf-checkbox-remember-me'
									name='rememberMe'
									aria-invalid={fieldState.invalid}
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
								<FieldLabel htmlFor='form-rhf-checkbox-remember-me' className='font-normal'>
									{t('auth.login.rememberMe')}
								</FieldLabel>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
							</Field>
						)}
					/>

					<Button variant='link'>
						<Link href={APP_ROUTES.forgetPassword} className='text-muted-foreground hover:text-primary'>
							{t('auth.login.forgotPassword')}
						</Link>
					</Button>
				</Field>
			</FieldGroup>

			<Field orientation='horizontal' className='w-full pt-4'>
				<Button
					type='submit'
					disabled={form.formState.isSubmitting}
					variant='default'
					size='lg'
					form='form-rhf'
					className='flex-1'
				>
					{t('auth.login.button')}
				</Button>
			</Field>
		</form>
	);
}
