import { fieldsValidation } from '@/shared/utils/validations/fields-validation';
import { z } from 'zod';

export const defaultValuesVerifyAccount = {
	otp: '',
	email: '',
};

export const verifyAccountSchema = z.object({
	otp: fieldsValidation.otp,
	email: fieldsValidation.email,
});

export type VerifyAccountInput = z.infer<typeof verifyAccountSchema>;

export const resendOtpSchema = z.object({
	email: fieldsValidation.email,
});

export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
