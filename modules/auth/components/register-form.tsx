'use client';

import { useRouter } from '@/i18n/navigation';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/components/custom-ui/field';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { formResponse } from '@/shared/hooks/form-response';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, User2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { startTransition, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { registerAction } from '../actions';
import { defaultValuesRegister, RegisterInput, registerSchema } from '../schemas/register.schema';

export default function RegisterForm() {
	const t = useTranslations();
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	const form = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
		defaultValues: defaultValuesRegister,
		mode: 'all',
	});

	const onSubmit = (data: RegisterInput) => {
		startTransition(async () => {
			const result = await registerAction(data);

			formResponse(result, form, {
				onSuccess: () => {
					router.push({
						pathname: APP_ROUTES.verifyAccount,
						query: { email: result.data?.email || '' },
					});
				},
			});
		});
	};

	return (
		<form id='form-register' onSubmit={form.handleSubmit(onSubmit)}>
			<FieldGroup>
				<Field orientation='horizontal' className='gap-4 items-baseline'>
					<Controller
						name='firstName'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='form-register-firstName'>{t('forms.labels.firstName')}</FieldLabel>
								<Input
									{...field}
									id='form-register-firstName'
									aria-invalid={fieldState.invalid}
									placeholder={t('forms.placeholders.firstName')}
									autoComplete='on'
								/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
							</Field>
						)}
					/>
					<Controller
						name='lastName'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='form-register-lastName'>{t('forms.labels.lastName')}</FieldLabel>
								<Input
									{...field}
									id='form-register-lastName'
									aria-invalid={fieldState.invalid}
									placeholder={t('forms.placeholders.lastName')}
									autoComplete='on'
								/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
							</Field>
						)}
					/>
				</Field>

				<Controller
					name='username'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor='form-register-username'>{t('forms.labels.username')}</FieldLabel>
							<div className='relative'>
								<div className='absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none'>
									<User2Icon className='w-4 h-4 text-gray-500' />
								</div>
								<Input
									{...field}
									id='form-register-username'
									aria-invalid={fieldState.invalid}
									placeholder={t('forms.placeholders.username')}
									autoComplete='on'
									className='ps-10'
								/>
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
						</Field>
					)}
				/>
				<Controller
					name='email'
					control={form.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor='form-register-email'>{t('forms.labels.email')}</FieldLabel>
							<div className='relative'>
								<div className='absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none'>
									<MailIcon className='w-4 h-4 text-gray-500' />
								</div>
								<Input
									{...field}
									id='form-register-email'
									aria-invalid={fieldState.invalid}
									placeholder={t('forms.placeholders.email')}
									autoComplete='on'
									className='ps-10'
								/>
							</div>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} t={t} />}
						</Field>
					)}
				/>
				<Field orientation='horizontal' className='gap-4 items-baseline'>
					<Controller
						name='password'
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor='form-register-password'>{t('forms.labels.password')}</FieldLabel>
								<div className='relative'>
									<div className='absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none'>
										<LockIcon className='w-4 h-4 text-gray-500' />
									</div>
									<Input
										type={showPassword ? 'text' : 'password'}
										{...field}
										id='form-register-password'
										aria-invalid={fieldState.invalid}
										placeholder={t('forms.placeholders.password')}
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
				</Field>
				{/* <Controller
					name='gender'
					control={form.control}
					render={({ field, fieldState }) => (
						<FieldSet>
							<FieldLegend className='text-sm'>Gender</FieldLegend>
							<FieldLabel htmlFor='form-register-confirmPassword'>{t('forms.labels.gender')}</FieldLabel>

							<RadioGroup className='flex' name={field.name} value={field.value} onValueChange={field.onChange}>
								<FieldLabel htmlFor={`form-rhf-radiogroup-male`}>
									<Field orientation='horizontal' data-invalid={fieldState.invalid}>
										<FieldContent>
											<FieldTitle>{t('forms.labels.male')}</FieldTitle>
											 <FieldDescription>Male</FieldDescription> 
										</FieldContent>
										<RadioGroupItem value='0' id={`form-rhf-radiogroup-male`} aria-invalid={fieldState.invalid} />
									</Field>
								</FieldLabel>
								<FieldLabel htmlFor={`form-rhf-radiogroup-female`}>
									<Field orientation='horizontal' data-invalid={fieldState.invalid}>
										<FieldContent>
											<FieldTitle>{t('forms.labels.female')}</FieldTitle>
											<FieldDescription>Male</FieldDescription> 
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
				/> */}
			</FieldGroup>

			{/* <CardFooter></CardFooter> */}
			<Field orientation='horizontal' className='w-full pt-4'>
				<Button type='submit' variant='default' size='lg' form='form-register' className='flex-1'>
					{t('auth.register.button')}
				</Button>
			</Field>
		</form>
	);
}
