import z from 'zod';

export const fieldsValidation = {
	firstName: z.string().min(3, 'forms.validation.firstName_min').max(30, 'forms.validation.firstName_max').trim(),
	lastName: z.string().min(2, 'forms.validation.lastName_min').max(30, 'forms.validation.lastName_max').trim(),
	username: z
		.string()
		.min(3, 'forms.validation.username_min')
		.max(30, 'forms.validation.username_max')
		.trim()
		.toLowerCase(),
	email: z.email('forms.validation.invalid_email').min(1, 'forms.validation.email_required').trim().toLowerCase(),
	password: z.string().min(6, 'forms.validation.password_min'),
	confirmPassword: z.string().min(6, 'forms.validation.password_min'),
	otp: z.string().min(6, 'forms.validation.otp_min'),
};
