'use client';

import { Skeleton } from '@/shared/components/ui/skeleton';
import { useTranslations } from 'next-intl';

export default function UserProfileSkeleton() {
	const t = useTranslations();

	return (
		<div className='w-full max-w-4xlxx mx-auto pb-16'>
			<div className={`relative h-64 sm:h-80 w-full group overflow-hidden transition-all duration-200`}>
				<Skeleton className='w-full h-full' />
			</div>
			<div className='relative container mx-auto mt-4 bg-cardxx bg-card-glass bg-gradient-to-t from-brand-primary/10 via-transparent to-transparent rounded-3xl shadow-xl border border-border/40 transition-all duration-300'>
				<div className='relative px-6 pb-6 pt-20 sm:pt-4 flex items-center justify-between gap-4'>
					<div className='absolute sm:relative -top-16 sm:top-0 left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-start'>
						<div className='relative overflow-hidden -mt-32 z-20 w-60 h-60 px-1x rounded-2xl border-4 border-primary/60 bg-card-glass shadow-md group/avatar'>
							<Skeleton className='w-60 h-60 rounded-2xl' />
						</div>
					</div>
					<div className='w-full flex flex-col gap-2'>
						<Skeleton className='w-full h-10 rounded-xl' />
						<Skeleton className='w-full h-20 rounded-xl' />
					</div>
				</div>
			</div>

			<div className='container mx-auto mt-6 bg-cardx bg-linear-to-br from-accent/20 to-brand-secondary/20 rounded-3xl p-6 sm:p-8 shadow-lg border border-border/40 transition-all duration-300'>
				{/* <div className='flex flex-col gap-2 w-full sm:w-auto justify-end pb-8'> */}
				<div className='ms-auto sm:w-1/3 flex gap-2 mb-8'>
					<Skeleton className='w-full h-8 rounded-xl' />
					<Skeleton className='w-full h-8 rounded-xl' />
				</div>
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fadeIn'>
					<Skeleton className='w-full h-10 rounded-xl' />
					<Skeleton className='w-full h-10 rounded-xl' />
					<Skeleton className='w-full h-10 rounded-xl' />
					<Skeleton className='w-full h-10 rounded-xl' />
					<Skeleton className='w-full h-10 rounded-xl' />
					<Skeleton className='w-full h-10 rounded-xl' />
					{/* </div> */}
				</div>
			</div>
		</div>
	);
}
