import { fieldsValidation } from '@/shared/utils/validations/fields-validation';
import { z } from 'zod';

export const defaultValuesChangeEmail = {
	// newEmail: '',
	// password:''
	otp: '',
};

// Default schemas without translations (for type inference)
export const changeEmailSchema = z.object({
	// newEmail: fieldsValidation.email,
	// password: fieldsValidation.password,
	otp: fieldsValidation.otp,
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
