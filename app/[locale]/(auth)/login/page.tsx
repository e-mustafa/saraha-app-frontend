'use client';

import { loginSchema, type LoginInput } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Link from 'next/link.js';
import { useForm } from 'react-hook-form';

export default function LoginPage() {
	const t = useTranslations('auth');
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginInput) => {
		console.log('Login data:', data);
		// TODO: Implement login logic with API client
	};

	return (
		<div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-sm'>
				<h2 className='mt-10 text-center text-2xl font-bold tracking-tight text-foreground'>{t('login')}</h2>
			</div>

			<div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
				<form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
					<div>
						<label htmlFor='email' className='block text-sm font-medium leading-6 text-foreground'>
							{t('email')}
						</label>
						<div className='mt-2'>
							<input
								{...register('email')}
								id='email'
								type='email'
								autoComplete='email'
								className='block w-full rounded-md border-0 bg-card-glass py-1.5 px-3 text-foreground shadow-sm ring-1 ring-inset ring-brand-primary/30 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6'
							/>
							{errors.email && <p className='mt-1 text-sm text-red-500'>{errors.email.message}</p>}
						</div>
					</div>

					<div>
						<label htmlFor='password' className='block text-sm font-medium leading-6 text-foreground'>
							{t('password')}
						</label>
						<div className='mt-2'>
							<input
								{...register('password')}
								id='password'
								type='password'
								autoComplete='current-password'
								className='block w-full rounded-md border-0 bg-card-glass py-1.5 px-3 text-foreground shadow-sm ring-1 ring-inset ring-brand-primary/30 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6'
							/>
							{errors.password && <p className='mt-1 text-sm text-red-500'>{errors.password.message}</p>}
						</div>
					</div>

					<div>
						<button
							type='submit'
							className='flex w-full justify-center rounded-md bg-brand-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary'
						>
							{t('login')}
						</button>
					</div>
				</form>

				<p className='mt-10 text-center text-sm text-gray-500'>
					{t('noAccount')}{' '}
					<Link href='/signup' className='font-semibold leading-6 text-brand-primary hover:text-brand-secondary'>
						{t('signup')}
					</Link>
				</p>
			</div>
		</div>
	);
}
