'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { toast } from 'sonner';

function ErrorWatcherContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const t = useTranslations('AuthErrors');

	const errorKey = searchParams.get('error');

	useEffect(() => {
		if (errorKey) {
			let errorMessage = '';

			// avoid crash if key not found in json file
			try {
				errorMessage = t.exists(errorKey) ? t(errorKey) : 'فشل عملية تسجيل الدخول، يرجى المحاولة مرة أخرى.';
			} catch (_e) {
				errorMessage = errorKey || 'فشل عملية تسجيل الدخول.';
			}

			toast.error(errorMessage, {
				id: 'auth-error-toast',
			});

			// clean url from query params after showing toast
			const params = new URLSearchParams(searchParams.toString());
			params.delete('error');
			const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
			router.replace(newUrl, { scroll: false });
		}
	}, [errorKey, t, pathname, router, searchParams]);

	return null;
}

export function AuthErrorWatcher() {
	return (
		<Suspense fallback={null}>
			<ErrorWatcherContent />
		</Suspense>
	);
}
