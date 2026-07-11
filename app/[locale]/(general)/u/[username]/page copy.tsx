'use client';

import { sendMessageSchema, type SendMessageInput } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

export default function AnonymousMessagePage({ params }: { params: { username: string } }) {
	const t = useTranslations('common');
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SendMessageInput>({
		resolver: zodResolver(sendMessageSchema),
	});

	const onSubmit = async (data: SendMessageInput) => {
		console.log('Message data:', { ...data, recipientUsername: params.username });
		// TODO: Implement message sending logic with API client
	};

	return (
		<div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-sm'>
				<h2 className='mt-10 text-center text-2xl font-bold tracking-tight text-foreground'>
					Send Anonymous Message to @{params.username}
				</h2>
			</div>

			<div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
				<form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
					<div>
						<label htmlFor='content' className='block text-sm font-medium leading-6 text-foreground'>
							Your Message
						</label>
						<div className='mt-2'>
							<textarea
								{...register('content')}
								id='content'
								rows={5}
								className='block w-full rounded-md border-0 bg-card-glass py-1.5 px-3 text-foreground shadow-sm ring-1 ring-inset ring-brand-primary/30 focus:ring-2 focus:ring-inset focus:ring-brand-primary sm:text-sm sm:leading-6'
							/>
							{errors.content && <p className='mt-1 text-sm text-red-500'>{errors.content.message}</p>}
						</div>
					</div>

					<div>
						<button
							type='submit'
							className='flex w-full justify-center rounded-md bg-brand-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary'
						>
							Send Message
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
