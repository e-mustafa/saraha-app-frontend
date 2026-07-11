import { Link } from '@/i18n/navigation';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { useTranslations } from 'next-intl';

export default function NavigationLinks() {
	const t = useTranslations('auth');
	return (
		<div className='text-center'>
			<p className='flex gap-2 justify-center'>
				<Link href={APP_ROUTES.login} className='text-primary hover:underline'>
					{t('navigation.backToLogin')}
				</Link>
				{t('navigation.noAccount')}
				<Link href={APP_ROUTES.register} className='text-primary hover:underline'>
					{t('register.button')}
				</Link>
			</p>
		</div>
	);
}
