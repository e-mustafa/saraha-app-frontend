'use client';

import { useRouter } from '@/i18n/navigation';
import { Field } from '@/shared/components/custom-ui/field';
import { Button } from '@/shared/components/ui/button';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { apiClient } from '@/shared/utils/apiClient';
import { ApiError } from '@/shared/utils/app-error';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { IResponse } from '../types';

export default function RevertEmailForm() {
	const t = useTranslations();
	const searchParams = useSearchParams();
	const router = useRouter();

	const email = searchParams.get('email') || '';
	const userId = searchParams.get('userId') || '';
	const token = searchParams.get('token') || '';

	const { mutate: RevertEmail, isPending: isVerifying } = useMutation<IResponse<null>, ApiError>({
		mutationFn: async () => {
			return apiClient.post<IResponse<null>>('/auth/verify-account', { token, newEmail: email, userId });
		},
		onError: (error) => {
			console.error('Verify account error:', error);
			// toast.error(error.message || 'Failed to verify account');
		},
		onSuccess: (res) => {
			// toast.success(res.message || 'Account verified successfully');
			router.push(APP_ROUTES.login);
		},
	});

	return (
		<div>
			<Field orientation='responsive' className='w-full pt-6'>
				<Button
					type='button'
					variant='outline'
					size='lg'
					onClick={() => router.push(APP_ROUTES.login)}
					disabled={isVerifying}
				>
					{t('auth.navigation.backToLogin')}
				</Button>
				<Button type='button' variant='default' size='lg' onClick={() => RevertEmail}>
					{isVerifying ? (
						<>
							{t('common.loading')}
							<Loader2Icon className='w-4 h-4 animate-spin ms-2' />
						</>
					) : (
						t('auth.revertEmail.button')
					)}
				</Button>
			</Field>
		</div>
	);
}
