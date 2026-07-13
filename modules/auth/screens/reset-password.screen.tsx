'use client';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useTranslations } from 'next-intl';
import NavigationLinks from '../components/navigation-links';
import ResetPasswordForm from '../components/reset-password-form';

export default function ResetPasswordScreen() {
	const t = useTranslations('auth');
	// const searchParams = useSearchParams();
	// const token = searchParams.get('token');
	// console.log('searchParams token', token);

	// useEffect(() => {
	// 	if (token === 'session_expired') {
	// 		toast.error('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى.');
	// 	}
	// }, [token]);

	return (
		<>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl'>{t('resetPassword.title')}</CardTitle>
				<CardDescription>{t('resetPassword.description')}</CardDescription>
			</CardHeader>

			<CardContent>
				<ResetPasswordForm />
			</CardContent>

			<NavigationLinks />
		</>
	);
}
