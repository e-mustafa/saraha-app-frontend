import { Button } from '@/shared/components/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFoundPage() {
	const t = useTranslations('notFoundPage');
	return (
		<div>
			<h1>{t('title')}</h1>
			<p>{t('description')}</p>
			<Button variant='outline' size='lg' asChild>
				<Link href='/'>{t('backHome')}</Link>
			</Button>
		</div>
	);
}
