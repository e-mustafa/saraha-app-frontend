import { Link } from '@/i18n/navigation';
import { CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { useTranslations } from 'next-intl';
import LoginWithSocial from '../components/login-with-social';
import RegisterForm from '../components/register-form';

export default function RegisterScreen() {
	const t = useTranslations('auth');

	return (
		<>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl'>{t('register.title')}</CardTitle>
				{/* <CardDescription className='text-lg'>{t('register.description')}</CardDescription> */}
			</CardHeader>

			<CardContent>
				<RegisterForm />
			</CardContent>

			<LoginWithSocial />

			<div className='text-center'>
				<p>
					{t('navigation.hasAccount')}{' '}
					<Link href={APP_ROUTES.login} className='text-primary hover:underline'>
						{t('login.button')}
					</Link>
				</p>
			</div>
		</>
	);
}
