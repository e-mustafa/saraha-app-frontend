import { Skeleton } from '@/shared/components/ui/skeleton';

export default function UserCardSkeleton() {
	return (
		<div className='relative mt-24 rounded-3xl border border-border/40 bg-brand-primary/5 backdrop-blur-xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center space-y-4'>
			{/* Glowing ambient blobs placeholder */}
			<div className='absolute -top-24 -left-20 w-72 h-72 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none' />
			<div className='absolute -bottom-24 -inset-e-20 w-72 h-72 bg-brand-secondary/5 rounded-full blur-[100px] pointer-events-none' />

			{/* Avatar Skeleton */}
			<Skeleton className='relative -mt-32 size-40 rounded-2xl /80 border-2 border-border/20 p-1 shadow-lg' />

			{/* User Info Skeleton */}
			<div className='space-y-3 flex flex-col items-center w-full'>
				{/* Name line */}
				<Skeleton className='h-8 w-48 rounded-xl' />
				{/* Username badge line */}
				<Skeleton className='h-6 w-32 rounded-full' />
				{/* Bio description line */}
				<Skeleton className='h-4 w-3/4 max-w-sm rounded-md' />
			</div>

			{/* Visitor stats counter skeleton */}
			<div className='w-full flex justify-start pt-2'>
				<Skeleton className='h-9 w-28 rounded-lg' />
			</div>
		</div>
	);
}
