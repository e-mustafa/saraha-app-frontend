import { cn } from '@/shared/utils/utils';
import { PlayIcon } from 'lucide-react';
import Image from 'next/image';
import { MessageMedia } from '../types/index';

export default function MediaGrid({ media }: { media: MessageMedia[] }) {
	const count = media.length;

	// هيكلة كلاسات التوزيع الجغرافي للصور بناءً على عددها
	const gridLayoutClass =
		count === 1
			? 'grid-cols-1'
			: count === 2
				? 'grid-cols-2'
				: count === 3
					? 'grid-cols-2 grid-rows-2'
					: 'grid-cols-2 grid-rows-2';

	return (
		<div className={`grid ${gridLayoutClass} gap-2 rounded-2xl overflow-hidden max-h-[380px] border border-border/20`}>
			{media.slice(0, 4).map((item, index) => {
				// إذا كانت 3 صور، نجعل الصورة الأولى تأخذ صفين كاملين بالطول لإضفاء مظهر مجلات الـ Premium UX
				const isLargeItemForThree = count === 3 && index === 0;

				return (
					<div
						key={item.id || index}
						className={cn(
							'relative group overflow-hidden  bg-black/10 cursor-pointer',
							// isLargeItemForThree ? 'row-span-2 h-full' : 'h-[180px]',
							// count === 1 ? 'h-[280px]' : '',
						)}
					>
						{item.type === 'video' ? (
							<>
								<video src={item.url} className='w-full h-full aspect-video object-cover' preload='metadata' muted />
								<div className='absolute inset-0 bg-black/30 flex items-center justify-center transition-colors group-hover:bg-black/40'>
									<div className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-md group-hover:scale-110 transition-transform'>
										<PlayIcon className='w-5 h-5 fill-current' />
									</div>
								</div>
							</>
						) : (
							<>
								<div className='size-full aspect-square'>
									<Image
										src={item.url}
										alt='Attached content'
										// fill
										width={128}
										height={128}
										className='object-cover size-full transition-transform duration-500 group-hover:scale-105'
										sizes='(max-width: 768px) 100vw, 50vw'
									/>
								</div>
								<div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
							</>
						)}
					</div>
				);
			})}
		</div>
	);
}
