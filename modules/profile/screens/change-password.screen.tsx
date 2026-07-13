import AuthCard from '@/modules/auth/components/auth-card';
import FormSectionSkeleton from '@/modules/auth/components/form-section-skeleton';
import { CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const ChangePasswordForm = dynamic(() => import('../components/change-password-form'), {
	loading: () => <FormSectionSkeleton />,
});

export default function ChangePasswordScreen() {
	const t = useTranslations('auth');

	return (
		<AuthCard>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl'>{t('changePassword.title')}</CardTitle>
				{/* <CardDescription>{t('changePassword.description')}</CardDescription> */}
			</CardHeader>

			<CardContent>
				<ChangePasswordForm />
			</CardContent>
		</AuthCard>
	);
}
