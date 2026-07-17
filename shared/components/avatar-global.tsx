import { Avatar, AvatarBadge, AvatarImage } from '@/shared/components/ui/avatar';
import { defaultImages } from '@/shared/config/app-configs';
import { UserLockIcon } from 'lucide-react';

type AvatarGlobalProps = {
	src?: string;
	alt?: string;
	name?: string;
	isLive?: boolean;
	isAnonymous?: boolean;
};

const getFallback = (name: string) => {
	if (!name) return '';

	if (name.length > 2) {
		if (name.includes(' ')) {
			const fullFallback = name
				.split(' ')
				.map((word) => word[0])
				.join('');
			return fullFallback;
		} else {
			return name.substring(0, 2);
		}
	}
	return name;
};

const AvatarGlobal = ({ src, alt = 'User Avatar', name, isLive = false, isAnonymous }: AvatarGlobalProps) => {
	return (
		<Avatar size='lg' className='min-w-14 min-h-14'>
			{(isAnonymous || !name) ? (
				<div className='size-full rounded-full grid place-items-center bg-brand-primary/30'>
					<UserLockIcon className='size-10 text-muted-foreground' />
				</div>
			) : (
				<AvatarImage src={src || defaultImages?.avatarMale} alt={alt} />
			)}
			{/* <AvatarFallback className='uppercase'>{getFallback(name)}</AvatarFallback> */}
			{/* <AvatarBadge className={isLive ? 'bg-green-600 dark:bg-green-800' : 'bg-gray-400 dark:bg-gray-600'} /> */}
		</Avatar>
	);
};

export default AvatarGlobal;
