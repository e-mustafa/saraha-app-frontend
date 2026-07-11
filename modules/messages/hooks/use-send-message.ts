// src/modules/messages/hooks/use-send-message.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '../services/message.service';

export function useSendMessage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: messageService.sendMessage,
		onSuccess: () => {
			// عمل invalidate للـ queries المناسبة إذا كنت بحاجة لتحديث فوري
		},
	});
}
