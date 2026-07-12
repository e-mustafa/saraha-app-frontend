import { fieldsValidation } from '@/shared/utils/validations/fields-validation';
import { z } from 'zod';

export const defaultValuesChangePassword = {
	oldPassword: '',
	newPassword: '',
	confirmPassword: '',
	isConfirmed: false,
	logoutAll: false,
};

// Default schemas without translations (for type inference)

export const changePasswordSchema = z
	.object({
		oldPassword: fieldsValidation.password,
		newPassword: fieldsValidation.password,
		confirmPassword: fieldsValidation.confirmPassword,
		isConfirmed: z.boolean(),
		logoutAll: z.boolean(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'forms.validation.password.mismatch',
		path: ['confirmPassword'],
	})
	// refine if password and confirmPassword are the same isConfirmed = true
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'forms.validation.confirmPassword_required',
		path: ['isConfirmed'],
	});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
