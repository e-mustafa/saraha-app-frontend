import VerifyAccountForm from '@/modules/auth/components/verify-account-form';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useTranslations } from 'next-intl';

export default function VerifyAccountScreen() {
	const t = useTranslations('auth');

	return (
		<>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl'>{t('steps.verifyTitle')}</CardTitle>
				<CardDescription>{t('steps.verifyDescription')}</CardDescription>
			</CardHeader>

			<CardContent>
				<VerifyAccountForm />
			</CardContent>
		</>
	);
}
