import { useTranslations } from 'next-intl';

export default function NotFoundPage() {
	const t = useTranslations('notFoundPage');
	return <h1>{t('title')}</h1>;
}
