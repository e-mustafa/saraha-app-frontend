import { Skeleton } from '@/shared/components/ui/skeleton';

export default function FormSectionSkeleton() {
	return (
		<div className='w-full space-y-4'>
			<div className='space-y-4'>
				<Skeleton className='h-5 1/3' />
				<Skeleton className='h-10 w-full' />
			</div>
			<div className='space-y-4'>
				<Skeleton className='h-5 1/3' />
				<Skeleton className='h-10 w-full' />
			</div>
			<div className='space-y-4'>
				<Skeleton className='h-5 1/3' />
				<Skeleton className='h-10 w-full' />
			</div>

			<div className='flex gap-4 space-y-4'>
				<Skeleton className='h-10 1/3' />
				<Skeleton className='h-10 1/3' />
			</div>
		</div>
	);
}
