'use client';
import { Button } from '@/shared/components/ui/button';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { GoogleLoginButton } from './google-login-button';

export default function LoginWithSocial() {
	const t = useTranslations();
	const underDev = () => {
		toast.info(t('common.underDev'));
	};

	return (
		<div className='flex flex-col items-center justify-center gap-3 w-full'>
			<div className='text-center flex items-center gap-2 px-4 w-full'>
				<div className='h-px border w-full'></div>
				<span className='text-nowrap'>{t('auth.social.orContinueWith')}</span>
				<div className='h-px border w-full'></div>
			</div>
			<div className='flex items-center gap-2'>
				{/* <Button variant='outline'>{t('auth.social.googleAccount')}</Button> */}
				<GoogleLoginButton />
				<Button type='button' variant='outline' className='min-h-12' onClick={underDev}>
					{t('auth.social.facebookAccount')}
				</Button>
			</div>
		</div>
	);
}
