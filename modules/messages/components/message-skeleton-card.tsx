import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function MessageSkeletonCard() {
	return (
		<Card className='w-full max-w-md bg-accent mx-auto'>
			<CardHeader className='flex items-center gap-4'>
				<Skeleton className='h-12 w-12 shrink-0 rounded-full' />
				<div className='space-y-2 w-full'>
					<Skeleton className='h-4 w-3/4' />
					<Skeleton className='h-4 w-2/3' />
				</div>
			</CardHeader>
			<CardContent>
				<Skeleton className='aspect-video w-full' />
			</CardContent>
		</Card>
	);
}
