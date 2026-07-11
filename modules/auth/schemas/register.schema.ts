import { fieldsValidation } from '@/shared/utils/validations/fields-validation';
import { z } from 'zod';

// Factory function to create schemas with dynamic translations
export const createAuthSchemas = (t: (key: string) => string) => {
	const loginSchema = z.object({
		email: z.email(t('forms.validation.invalid_email')).min(1, t('forms.validation.email_required')).trim().toLowerCase(),
		password: z.string().min(6, t('forms.validation.password_min')),
		rememberMe: z.boolean().optional(),
	});

	const registerSchema = z
		.object({
			firstName: z
				.string()
				.min(3, t('forms.validation.firstName_min'))
				.max(30, t('forms.validation.firstName_max'))
				.trim(),
			lastName: z.string().min(2, t('forms.validation.lastName_min')).max(30, t('forms.validation.lastName_max')).trim(),
			username: z
				.string()
				.min(3, t('forms.validation.username_min'))
				.max(30, t('forms.validation.username_max'))
				.trim()
				.toLowerCase(),
			email: z
				.email(t('forms.validation.invalid_email'))
				.min(1, t('forms.validation.email_required'))
				.trim()
				.toLowerCase(),
			password: z.string().min(6, t('forms.validation.password_min')),
			confirmPassword: z.string().min(6, t('forms.validation.password_min')),
			// gender: z.enum(GENDERS),
			// .refine((value) => Object.values(GENDERS_ENUM).includes(value as number), {
			// 	message: t('forms.validation.gender_required'),
			// }),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t('forms.validation.passwords_mismatch'),
			path: ['confirmPassword'],
		});

	return { loginSchema, registerSchema };
};

export const defaultValuesRegister = {
	firstName: '',
	lastName: '',
	username: '',
	email: '',
	password: '',
	confirmPassword: '',
};

// Default schemas without translations (for type inference)

export const registerSchema = z
	.object({
		firstName: fieldsValidation.firstName,
		lastName: fieldsValidation.lastName,
		username: fieldsValidation.username,
		email: fieldsValidation.email,
		password: fieldsValidation.password,
		confirmPassword: fieldsValidation.confirmPassword,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'forms.validation.passwords_mismatch',
		path: ['confirmPassword'],
	});

export type RegisterInput = z.infer<typeof registerSchema>;
