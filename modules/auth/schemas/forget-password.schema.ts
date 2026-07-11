import { fieldsValidation } from '@/shared/utils/validations/fields-validation';
import { z } from 'zod';

export const defaultValuesForgetPassword = {
	email: '',
};

// Default schemas without translations (for type inference)
export const forgetPasswordSchema = z.object({
	email: fieldsValidation.email,
});

export type ForgetPasswordInput = z.infer<typeof forgetPasswordSchema>;
