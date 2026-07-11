// components/ZodConfigInitializer.tsx
'use client';

import { getZodErrorMap } from '@/shared/utils/validations/zodErrorMap';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

export function ZodConfigInitializer({ children }: { children: React.ReactNode }) {
	const t = useTranslations();

	// سيتم تحديث الـ config تلقائياً إذا تغيرت لغة التطبيق (ar / en)
	z.config({ localeError: getZodErrorMap(t) });

	return <>{children}</>;
}
