import { Button } from '@/shared/components/ui/button';
import { IMetadata } from '@/shared/types/index';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

type MessagesPaginationProps = {
	metadata: IMetadata;
	currentPage: number;
	setCurrentPage: (prev: number) => void;
	isFetching: boolean;
};

export default function MessagesPagination({ metadata, currentPage, setCurrentPage, isFetching }: MessagesPaginationProps) {
	const t = useTranslations('messages');

	return (
		<div className='flex items-center justify-between border-t border-border/40 pt-6 animate-in fade-in'>
			<p className='text-xs sm:text-sm text-muted-foreground'>
				{t('pagination.page')}
				<span className='font-semibold text-foreground'>{metadata.currentPage}</span> {t('pagination.of')}{' '}
				<span className='font-semibold text-foreground'>{metadata.totalPages}</span>
			</p>
			<div className='flex items-center gap-2'>
				<Button
					variant='outline'
					size='sm'
					className='rounded-xl'
					disabled={currentPage === 1 || isFetching}
					onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
				>
					<ChevronRightIcon className='w-4 h-4 ml-1' />
					{t('pagination.previous')}
				</Button>
				<Button
					variant='outline'
					size='sm'
					className='rounded-xl'
					disabled={currentPage === metadata.totalPages || isFetching}
					onClick={() => setCurrentPage(Math.min(currentPage + 1, metadata.totalPages))}
				>
					{t('pagination.next')}
					<ChevronLeftIcon className='w-4 h-4 mr-1' />
				</Button>
			</div>
		</div>
	);
}
