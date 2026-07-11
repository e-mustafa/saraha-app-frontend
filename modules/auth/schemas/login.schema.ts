import { fieldsValidation } from '@/shared/utils/validations/fields-validation';
import { z } from 'zod';

export const defaultValuesLogin = {
	email: '',
	password: '',
	rememberMe: false,
};

// Default schemas without translations (for type inference)
export const loginSchema = z.object({
	email: fieldsValidation.email,
	password: fieldsValidation.password,
	rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
