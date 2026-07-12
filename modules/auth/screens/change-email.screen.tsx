'use client';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import FormSectionSkeleton from '../components/form-section-skeleton';

// dynamic import to avoid SSR issues
const ChangeEmailForm = dynamic(() => import('../components/change-email-form'), {
	ssr: false,
	loading: () => <FormSectionSkeleton />,
});

export default function ChangeEmailScreen() {
	const t = useTranslations('auth');

	return (
		<>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl'>{t('changeEmail.title')}</CardTitle>
				<CardDescription className='text-lg'>{t('changeEmail.description')}</CardDescription>
			</CardHeader>

			<CardContent>
				<ChangeEmailForm />
			</CardContent>
		</>
	);
}
