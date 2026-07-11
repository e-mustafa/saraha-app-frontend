import { cn } from '@/shared/utils/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
	return <div data-slot='skeleton' className={cn('animate-pulse rounded-md bg-card/40', className)} {...props} />;
}

export { Skeleton };
