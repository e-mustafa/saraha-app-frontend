// import { getTranslations } from 'next-intl/server';
import { ZodSchema } from 'zod';
// import { $ZodErrorMap, $ZodIssue } from 'zod/v4/core';
// import { getZodCustomError } from './zodErrorMap';

export type ValidationResult<T> =
	| {
			success: true;
			ok: true;
			data: T;
			message?: string;
	  }
	| {
			success: false;
			ok: false;
			status: number;
			data: T;
			errors: Partial<Record<keyof T, string[]>>;
	  };

export async function ValidateFormAction<T>(schema: ZodSchema<T>, formData: unknown): Promise<ValidationResult<T>> {
	const rawData = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

	// const t = await getTranslations();

	// تنفيذ التحقق مع تمرير دالة الأخطاء الجديدة لـ Zod v4
	const { success, data, error } = await schema.safeParse(
		rawData,
		// { error: getZodCustomError(t) as $ZodErrorMap<$ZodIssue> }
		// { errorMap: getZodCustomError(t) as $ZodErrorMap<$ZodIssue> },
	);

	if (!success) {
		return {
			success: false,
			ok: false,
			status: 400,
			data: rawData as T,
			errors: error.flatten().fieldErrors as Partial<Record<keyof T, string[]>>,
		};
	}

	return {
		success: true,
		ok: true,
		data: data as T,
	};
}
