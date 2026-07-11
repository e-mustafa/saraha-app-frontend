// src/modules/messages/components/send-message-form.tsx
'use client';

import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useSendMessage } from '../hooks/use-send-message';
import { messageSchema, type MessageFormValues } from '../validation/message.schema';

export function SendMessageForm({ username }: { username: string }) {
	const t = useTranslations('Messages');
	const { mutate: sendMessage, isPending } = useSendMessage();

	const form = useForm<MessageFormValues>({
		resolver: zodResolver(messageSchema),
		defaultValues: { content: '' },
	});

	const onSubmit = (data: MessageFormValues) => {
		sendMessage(
			{ username, content: data.content },
			{
				onSuccess: () => form.reset(),
			},
		);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<FormField
					control={form.control}
					name='content'
					render={({ field }) => (
						<FormItem>
							<Textarea placeholder={t('placeholder')} {...field} />
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' disabled={isPending}>
					{isPending ? t('sending') : t('send')}
				</Button>
			</form>
		</Form>
	);
}
