'use client';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useTranslations } from 'next-intl';
import ForgetPasswordForm from '../components/forget-password-form';
import NavigationLinks from '../components/navigation-links';

export default function ForgetPasswordScreen() {
	const t = useTranslations('auth');

	return (
		<>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl'>{t('forgotPassword.title')}</CardTitle>
				<CardDescription className='text-lg'>{t('forgotPassword.description')}</CardDescription>
			</CardHeader>

			<CardContent>
				<ForgetPasswordForm />
			</CardContent>

			<NavigationLinks />
		</>
	);
}
