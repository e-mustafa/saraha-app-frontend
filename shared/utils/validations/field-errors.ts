import { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

export const setFieldErrors = <TFieldValues extends FieldValues>(
	errors: Record<string, string | string[]>,
	form: UseFormReturn<TFieldValues>,
) => {
	if (!errors) return;

	Object.entries(errors).forEach(([key, value]) => {
		// ensure message is string even if it comes as array from server
		const message = Array.isArray(value) ? value?.join('.\n') : value;

		form.setError(key as FieldPath<TFieldValues>, {
			type: 'manual',
			message: message || 'Invalid value',
		});
	});
};
