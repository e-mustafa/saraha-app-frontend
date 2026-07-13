import { CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useTranslations } from 'next-intl';
import RevertEmailForm from '../components/revert-email-form';

export default function RevertEmailScreen() {
	const t = useTranslations('auth');

	return (
		<>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl'>{t('revertEmail.title')}</CardTitle>
				<CardDescription>{t('revertEmail.description')}</CardDescription>
			</CardHeader>

			<CardContent>
				<RevertEmailForm />
			</CardContent>
		</>
	);
}
