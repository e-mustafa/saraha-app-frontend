'use client';
import { Link } from '@/i18n/navigation';
import LoginForm from '@/modules/auth/components/login-form';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { useTranslations } from 'next-intl';
import LoginWithSocial from '../components/login-with-social';

export default function LoginScreen() {
	const t = useTranslations('auth');

	return (
		<>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl'>{t('login.title')}</CardTitle>
				<CardDescription className='text-lg'>{t('login.description')}</CardDescription>
			</CardHeader>

			<CardContent>
				<LoginForm />
			</CardContent>

			<LoginWithSocial />

			<div className='text-center'>
				<p>
					{t('navigation.noAccount')}{' '}
					<Link href={APP_ROUTES.register} className='text-primary hover:underline'>
						{t('register.title')}
					</Link>
				</p>
			</div>
		</>
	);
}
