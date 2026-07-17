import { Button } from '@/shared/components/ui/button';
import { configEnv } from '@/shared/config/env';
import { Share2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface ShareButtonProps {
	username: string;
}

export default function ShareButton({ username }: ShareButtonProps) {
	const t = useTranslations('profile');
	// Construct the direct profile URL
	const shareUrl = `${configEnv.apiBaseUrl}/u/${username}`;

	const handleShare = async () => {
		if (navigator.share) {
			try {
				// Trigger native mobile sharing sheet
				await navigator.share({
					title: t('shareSheet.title'),
					text: t('shareSheet.description'),
					url: shareUrl,
				});
			} catch (error) {
				console.error('Error sharing:', error);
			}
		} else {
			// Fallback: Copy link to clipboard if Web Share API is not supported
			try {
				await navigator.clipboard.writeText(shareUrl);
				toast.success(t('copiedSuccess'));
			} catch (err) {
				console.error('Failed to copy link:', err);
			}
		}
	};

	return (
		<Button variant='outline' title={t('share')} onClick={handleShare}>
			<Share2Icon className='w-5 h-5' />
		</Button>
	);
}
