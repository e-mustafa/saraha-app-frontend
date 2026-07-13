'use client';

import { useMessages, useTranslations } from 'next-intl'; // 1. Import useMessages hook
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { toast } from 'sonner';

function ErrorWatcherContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const t = useTranslations('AuthErrors');

	// 2. Fetch the complete dictionary of translations available
	const messages = useMessages();

	const errorKey = searchParams.get('error');

	useEffect(() => {
		if (errorKey) {
			let errorMessage = '';

			// 3. Extract AuthErrors section and check if the key exists safely
			const authErrors = (messages as Record<string, Record<string, string>>)?.['AuthErrors'];
			const keyExists = authErrors && errorKey in authErrors;

			if (keyExists) {
				errorMessage = t(errorKey);
			} else {
				// Fallback generic message if the error key is not defined in the JSON file
				errorMessage = 'فشل عملية تسجيل الدخول، يرجى المحاولة مرة أخرى.';
			}

			toast.error(errorMessage, {
				id: 'auth-error-toast',
			});

			// Clean URL from query params after showing toast
			const params = new URLSearchParams(searchParams.toString());
			params.delete('error');
			const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
			router.replace(newUrl, { scroll: false });
		}
	}, [errorKey, t, messages, pathname, router, searchParams]);

	return null;
}

export function AuthErrorWatcher() {
	return (
		<Suspense fallback={null}>
			<ErrorWatcherContent />
		</Suspense>
	);
}
