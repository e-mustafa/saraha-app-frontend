import { z } from 'zod';

export const sendMessageSchema = z.object({
	content: z.string().min(1, 'Message cannot be empty').max(500, 'Message must be less than 500 characters'),
	recipientUsername: z.string().min(3, 'Username must be at least 3 characters'),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
