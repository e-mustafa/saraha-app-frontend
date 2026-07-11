import { fieldsValidation } from '@/shared/utils/validations/fields-validation';
import { z } from 'zod';

export const defaultValuesResetPassword = {
	email: '',
	password: '',
	confirmPassword: '',
	logoutAll: false,
};

// Default schemas without translations (for type inference)
export const resetPasswordSchema = z
	.object({
		token: z.string(),
		password: fieldsValidation.password,
		confirmPassword: fieldsValidation.confirmPassword,
		logoutAll: z.boolean().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'forms.validation.passwords_mismatch',
		path: ['confirmPassword'],
	});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
