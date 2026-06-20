import { useTranslations } from 'next-intl';

export default function VerifyEmailPage() {
	const t = useTranslations('common');

	return (
		<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-foreground">
					Verify Your Email
				</h2>
				<p className="mt-4 text-center text-gray-500">
					Please check your email for a verification link.
				</p>
			</div>
		</div>
	);
}
