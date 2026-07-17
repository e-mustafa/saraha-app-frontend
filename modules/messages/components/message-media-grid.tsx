import { cn } from '@/shared/utils/utils';
import { PlayIcon } from 'lucide-react';
import Image from 'next/image';
import { MessageMedia } from '../types/index';

export default function MediaGrid({ media }: { media: MessageMedia[] }) {
	const count = media.length;

	// Define responsive grid columns based on media count
	const gridLayoutClass = count === 1 ? 'grid-cols-1' : count === 2 ? 'grid-cols-2' : 'grid-cols-2 grid-rows-2';

	return (
		<div className={cn('grid gap-2 rounded-2xl overflow-hidden border border-border/20', gridLayoutClass)}>
			{media.slice(0, 4).map((item, index) => {
				// Apply a premium magazine layout if exactly 3 images are present (first one spans 2 rows)
				const isLargeItemForThree = count === 3 && index === 0;

				return (
					<div
						key={item.id || index}
						className={cn(
							'relative group overflow-hidden bg-black/10 cursor-pointer w-full',
							// Dynamic heights based on grid counts to prevent layout collapses
							isLargeItemForThree ? 'row-span-2 h-full min-h-[320px]' : 'h-[160px] md:h-[200px]',
							count === 1 ? 'h-[280px] md:h-[360px]' : '',
							count === 2 ? 'h-[180px] md:h-[240px]' : '',
						)}
					>
						{/* Fixed check from 'audio' to 'video' for proper rendering */}
						{item.fileType === 'video' ? (
							<div className='relative size-full'>
								<video src={item.url} className='w-full h-full object-cover' preload='metadata' muted />
								<div className='absolute inset-0 bg-black/30 flex items-center justify-center transition-colors group-hover:bg-black/40'>
									<div className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-md group-hover:scale-110 transition-transform'>
										<PlayIcon className='w-5 h-5 fill-current' />
									</div>
								</div>
							</div>
						) : (
							<div className='relative size-full'>
								{/* Switched to layout 'fill' for dynamic, responsive container wrapping */}
								<Image
									src={item.url}
									alt='Attached content'
									fill
									className='object-cover transition-transform duration-500 group-hover:scale-105'
									sizes='(max-width: 768px) 100vw, 50vw'
								/>
								<div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
