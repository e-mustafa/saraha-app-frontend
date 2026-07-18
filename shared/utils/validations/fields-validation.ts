import z from 'zod';
import { msgKey } from './translate.utils';

export const fieldsValidation = {
	firstName: z
		.string()
		.trim()
		.min(2, msgKey('forms.validation.firstName.min', { min: 2 }))
		.max(50, msgKey('forms.validation.firstName.max', { max: 50 })),
	lastName: z
		.string()
		.trim()
		.min(2, msgKey('forms.validation.lastName.min', { min: 2 }))
		.max(50, msgKey('forms.validation.lastName.max', { max: 50 })),
	username: z
		.string()
		.trim()
		.min(6, msgKey('forms.validation.username.min', { min: 6 }))
		.max(25, msgKey('forms.validation.username.max', { max: 25 }))
		.toLowerCase(),
	email: z.email(msgKey('forms.validation.email.invalid')).trim().toLowerCase(),

	password: z.string().min(6, msgKey('forms.validation.password.min', { min: 6 })),
	confirmPassword: z.string().min(6, msgKey('forms.validation.password.mismatch')),

	gender: z.number().min(0).max(1),
	birthdate: z.coerce
		.date()
		.max(new Date(), msgKey('forms.validation.birthdate.max'))
		.refine(
			(date) => {
				if (!date) return true;

				const today = new Date();
				const cutoffDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
				return date <= cutoffDate;
			},
			{ message: msgKey('forms.validation.birthdate.underAge') }, // 'zod.date'  },
		)
		.optional(),

	phone: z
		.string()
		.trim()
		.min(10, msgKey('forms.validation.phone.min', { min: 10 })),
	bio: z
		.string()
		.trim()
		.max(160, msgKey('forms.validation.bio.max', { max: 160 }))
		.optional(),

	avatar: z.string().optional(),
	covers: z.array(z.string()).optional(),
	otp: z
		.string()
		.trim()
		.min(6, msgKey('forms.validation.otp.min', { min: 6 })),
};
