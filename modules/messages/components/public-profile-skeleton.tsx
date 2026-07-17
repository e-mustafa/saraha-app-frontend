'use client';

import UserCardSkeleton from '@/modules/profile/components/user-card-skeleton';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function PublicProfileSkeleton() {
	return (
		<div className='w-full max-w-3xl mx-auto px-4 py-8 space-y-8 overflow-hidden'>
			{/* ================= SKELETON: USER SECTION ================= */}

			<UserCardSkeleton />

			{/* ================= SKELETON: SARAHA FORM CARD ================= */}
			<Card className='overflow-hidden bg-card-blur rounded-3xl border border-white/5 shadow-xl'>
				<CardContent className='space-y-5 p-6'>
					{/* Header actions skeleton */}
					<div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-border/40 pb-4'>
						<Skeleton className='w-24 h-5 rounded-md' />
						<div className='flex items-center gap-4 w-full sm:w-auto justify-between'>
							<Skeleton className='h-5 w-20 rounded-md' />
							<Skeleton className='h-5 w-20 rounded-md border-s border-border/40 ps-4' />
						</div>
					</div>

					{/* Textarea field placeholder */}
					<Skeleton className='h-32 w-full /30 rounded-2xl border border-border/20' />

					{/* Drag & drop zone placeholder */}
					<Skeleton className='h-24 w-full border-2 border-dashed border-border/40 rounded-2xl' />

					{/* Footer actions row placeholder */}
					<div className='flex items-center justify-end border-t border-border/40 pt-4'>
						<Skeleton className='h-11 w-36  rounded-xl' />
					</div>
				</CardContent>
			</Card>

			{/* ================= SKELETON: PUBLIC MESSAGES FEED ================= */}
			<div className='space-y-4 pt-4'>
				<div className='flex items-center gap-2 border-b border-border/40 pb-3'>
					<Skeleton className='h-4 w-1  rounded-full' />
					<Skeleton className='h-6 w-48 rounded-md' />
				</div>
				{/* Mimicking message feed stack */}
				<div className='space-y-4'>
					<Skeleton className='h-36 w-full rounded-2xl border border-border/20' />
					<Skeleton className='h-36 w-full rounded-2xl border border-border/20' />
				</div>
			</div>
		</div>
	);
}
