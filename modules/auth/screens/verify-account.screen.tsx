import VerifyAccountForm from '@/modules/auth/components/verify-account-form';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useTranslations } from 'next-intl';

export default function VerifyAccountScreen() {
	const t = useTranslations('auth');

	return (
		<>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl'>{t('verifyAccountTitle')}</CardTitle>
				<CardDescription className='text-lg'>{t('verifyAccountDescription')}</CardDescription>
			</CardHeader>

			<CardContent>
				<VerifyAccountForm />
			</CardContent>
		</>
	);
}
