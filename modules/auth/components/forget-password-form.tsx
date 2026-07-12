'use client';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/components/custom-ui/field';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { formResponse } from '@/shared/hooks/form-response';
import { zodResolver } from '@hookform/resolvers/zod';
import { MailIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { startTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { forgetPasswordAction } from '../actions';
import { defaultValuesForgetPassword, ForgetPasswordInput, forgetPasswordSchema } from '../schemas/forget-password.schema';

export default function ForgetPasswordForm() {
	const t = useTranslations();
	const router = useRouter();

	const form = useForm<ForgetPasswordInput>({
		resolver: zodResolver(forgetPasswordSchema),
		defaultValues: defaultValuesForgetPassword,
		mode: 'all',
	});

	const onSubmit = (data: ForgetPasswordInput) => {
		startTransition(async () => {
			const result = await forgetPasswordAction(data);
			
			formResponse(result, form, {
				onSuccess: () => {
					router.push(APP_ROUTES.login);
					// router.refresh();
					// router.push(`${APP_ROUTES.verifyAccount}?email=${result.data.email}`);
				},
			});
		});
	};
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
			</FieldGroup>

			{/* <CardFooter></CardFooter> */}
			<Field orientation='horizontal' className='w-full pt-4'>
				<Button
					type='submit'
					disabled={form.formState.isSubmitting}
					variant='default'
					size='lg'
					form='form-rhf'
					className='flex-1'
				>
					{t('auth.forgotPassword.button')}
				</Button>
			</Field>
		</form>
	);
}
