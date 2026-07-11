import { fieldsValidation } from '@/shared/utils/validations/fields-validation';
import { z } from 'zod';

export const defaultValuesVerifyAccount = {
	otp: '',
	email: '',
};

// Default schemas without translations (for type inference)
export const verifyAccountSchema = z.object({
	otp: z.string().min(6, 'forms.validation.otp_min'),
	email: fieldsValidation.email,
});

export type VerifyAccountInput = z.infer<typeof verifyAccountSchema>;

export const resendOtpSchema = z.object({
	email: fieldsValidation.email,
});

export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
