import { fieldsValidation } from '@/shared/utils/validations/fields-validation';
import { z } from 'zod';

export const defaultValuesRChangeEmail = {
	newEmail: '',
	password: '',
};

// Default schemas without translations (for type inference)
export const requestChangeEmailSchema = z.object({
	newEmail: fieldsValidation.email,
	password: fieldsValidation.password,
});

export type RequestChangeEmailInput = z.infer<typeof requestChangeEmailSchema>;
