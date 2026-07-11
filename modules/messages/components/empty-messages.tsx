import { MessageSquareIcon, MessageSquareTextIcon } from 'lucide-react';

const EmptyMessages = () => {
	return (
		<div className='flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-dashed border-border/60 bg-card animate-in fade-in duration-300'>
			{/* <MessageSquareIcon className='w-12 h-12 text-muted-foreground/50 mb-3' /> */}
			<MessageSquareTextIcon className='size-32 text-muted-foreground/50 mb-3 animate-bounce anim' />
			<h3 className='text-lg font-bold text-foreground'>لا توجد رسائل بعد</h3>
			<p className='text-sm text-muted-foreground max-w-xs mt-1'>الرسائل الجديدة التي ستتلقاها ستظهر هنا مباشرة.</p>
		</div>
	);
};

export default EmptyMessages;
