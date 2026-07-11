'use client';

import { Card, CardContent } from '@/shared/components/ui/card';

export default function PublicProfileSkeleton() {
	return (
		<div className='w-full max-w-3xl mx-auto px-4 py-8 space-y-8 animate-pulse overflow-hidden'>
			{/* ================= SKELETON: USER SECTION ================= */}
			<div className='relative mt-24 rounded-3xl border border-border/40 bg-brand-primary/5 backdrop-blur-xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center space-y-4'>
				{/* Glowing ambient blobs placeholder */}
				<div className='absolute -top-24 -left-20 w-72 h-72 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none' />
				<div className='absolute -bottom-24 -inset-e-20 w-72 h-72 bg-brand-secondary/5 rounded-full blur-[100px] pointer-events-none' />

				{/* Avatar Skeleton */}
				<div className='relative -mt-32 size-40 rounded-2xl bg-muted/80 border-2 border-border/20 p-1 shadow-lg' />

				{/* User Info Skeleton */}
				<div className='space-y-3 flex flex-col items-center w-full'>
					{/* Name line */}
					<div className='h-8 w-48 bg-muted rounded-xl' />
					{/* Username badge line */}
					<div className='h-6 w-32 bg-muted/60 rounded-full' />
					{/* Bio description line */}
					<div className='h-4 w-3/4 max-w-sm bg-muted/40 rounded-md' />
				</div>

				{/* Visitor stats counter skeleton */}
				<div className='w-full flex justify-start pt-2'>
					<div className='h-9 w-28 bg-muted/50 rounded-lg' />
				</div>
			</div>

			{/* ================= SKELETON: SARAHA FORM CARD ================= */}
			<Card className='overflow-hidden bg-card-blur rounded-3xl border border-white/5 shadow-xl'>
				<CardContent className='space-y-5 p-6'>
					{/* Header actions skeleton */}
					<div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-border/40 pb-4'>
						<div className='flex items-center gap-2 w-24 h-5 bg-muted/60 rounded-md' />
						<div className='flex items-center gap-4 w-full sm:w-auto justify-between'>
							<div className='h-5 w-20 bg-muted/40 rounded-md' />
							<div className='h-5 w-20 bg-muted/40 rounded-md border-s border-border/40 ps-4' />
						</div>
					</div>

					{/* Textarea field placeholder */}
					<div className='h-32 w-full bg-muted/30 rounded-2xl border border-border/20' />

					{/* Drag & drop zone placeholder */}
					<div className='h-24 w-full bg-muted/20 border-2 border-dashed border-border/40 rounded-2xl' />

					{/* Footer actions row placeholder */}
					<div className='flex items-center justify-between border-t border-border/40 pt-4'>
						<div className='size-10 bg-muted/50 rounded-xl' />
						<div className='h-11 w-36 bg-muted rounded-xl' />
					</div>
				</CardContent>
			</Card>

			{/* ================= SKELETON: PUBLIC MESSAGES FEED ================= */}
			<div className='space-y-4 pt-4'>
				<div className='flex items-center gap-2 border-b border-border/40 pb-3'>
					<div className='h-4 w-1 bg-muted rounded-full' />
					<div className='h-6 w-48 bg-muted/70 rounded-md' />
				</div>
				{/* Mimicking message feed stack */}
				<div className='space-y-4'>
					<div className='h-36 w-full bg-muted/20 rounded-2xl border border-border/20' />
					<div className='h-36 w-full bg-muted/20 rounded-2xl border border-border/20' />
				</div>
			</div>
		</div>
	);
}
