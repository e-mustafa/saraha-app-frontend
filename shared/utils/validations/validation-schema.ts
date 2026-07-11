import { getTranslations } from 'next-intl/server';
import { ZodSchema } from 'zod';
import { getZodErrorMap } from './zodErrorMap';

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
			form_errors: Partial<Record<keyof T, string[]>>;
	  };

export async function ValidateFormAction<T>(schema: ZodSchema<T>, formData: unknown): Promise<ValidationResult<T>> {
	// process FormData to Object if it is FormData
	const rawData = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData;

	// get translation function for current request (server side)
	const t = await getTranslations();

	// execute validation with local error map for Zod v4
	const { success, data, error } = schema.safeParse(rawData, {
		error: getZodErrorMap(t),
	});

	if (!success) {
		return {
			success: false,
			ok: false,
			status: 400,
			data: rawData as T,
			// flatten errors and make them match the schema keys
			form_errors: error.flatten().fieldErrors as Partial<Record<keyof T, string[]>>,
		};
	}

	return {
		success: true,
		ok: true,
		data: data as T,
	};
}
