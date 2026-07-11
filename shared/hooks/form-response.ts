import { IResponse } from '@/modules/auth';
import { setFieldErrors } from '@/shared/utils/validations/field-errors';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

type TFormResponseParams<T> = {
	successMessage?: string;
	errorMessage?: string;
	onSuccess?: () => void;
	onError?: () => void;
};

export function formResponse<T extends Record<string, unknown>>(
	result: IResponse,
	form: UseFormReturn<T>,
	{ successMessage = '', errorMessage = '', onSuccess, onError }: TFormResponseParams<T>,
) {
	// set form errors from result
	if (!result.success) {
		if (result?.errors) {
			setFieldErrors(result.errors, form);

			// const bodyErrors = Object.keys(result?.errors?.body || {});
			// const errors = result?.errors?.body;
			// // set errors in form

			// bodyErrors?.forEach((key) => {
			// 	form.setError(key as keyof T, {
			// 		type: 'manual',
			// 		message: errors[key as keyof typeof errors] as string,
			// 	});
			// });
		}
		if (result.message) {
			// عرض الخطأ القادم من Express أو السيرفر
			toast.error(errorMessage || result.message);
			onError?.();
			return;
		}
	}
	if (result.success) {
		if (result.message) {
			toast.success(successMessage || result.message);
		}

		onSuccess?.();
	}
}
