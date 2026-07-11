'use client';
import AuthCard from '@/modules/auth/components/auth-card';
import FormSectionSkeleton from '@/modules/auth/components/form-section-skeleton';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// dynamic import to avoid SSR issues
const RequestChangeEmailForm = dynamic(() => import('../components/request-change-email-form'), {
	ssr: false,
	// loading: () => <FormSectionSkeleton />,
});

export default function RequestChangeEmailScreen() {
	const t = useTranslations('auth');

	return (
		<AuthCard>
			<CardHeader className='text-center'>
				<CardTitle className='text-2xl'>{t('requestChangeEmail.title')}</CardTitle>
				<CardDescription className='text-lg'>{t('requestChangeEmail.description')}</CardDescription>
			</CardHeader>

			<CardContent>
				<Suspense fallback={<FormSectionSkeleton />}>
				<RequestChangeEmailForm />
				</Suspense>
			</CardContent>
		</AuthCard>
	);
}
