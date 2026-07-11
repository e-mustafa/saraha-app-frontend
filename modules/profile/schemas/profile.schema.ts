import { z } from 'zod';

export const profileSchema = z.object({
	firstName: z.string().min(2, 'errors.firstNameMin'),
	lastName: z.string().min(2, 'errors.lastNameMin'),
	username: z.string().min(3, 'errors.usernameMin'),
	email: z.string().email('errors.invalidEmail'),
	phone: z.string().min(10, 'errors.invalidPhone'),
	gender: z.number().min(0).max(1),
	birthdate: z.string().min(1, 'errors.birthdateRequired'),
	bio: z.string().max(160, 'errors.bioMax').optional(),

	avatar: z.string().optional(),
	covers: z.array(z.string()).optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const defaultValuesProfile: ProfileInput = {
	firstName: '',
	lastName: '',
	username: '',
	email: '',
	phone: '',
	gender: 0,
	birthdate: '',
	bio: '',
	avatar: '',
	covers: [],
};
