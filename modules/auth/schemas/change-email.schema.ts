import { fieldsValidation } from '@/shared/utils/validations/fields-validation';
import { z } from 'zod';

export const defaultValuesChangeEmail = {
	otp: '',
};

export const changeEmailSchema = z.object({
	otp: fieldsValidation.otp,
});

export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
