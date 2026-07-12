import { fieldsValidation } from '@/shared/utils/validations/fields-validation';
import { z } from 'zod';

export const profileSchema = z.object({
	firstName: fieldsValidation.firstName,
	lastName: fieldsValidation.lastName,
	username: fieldsValidation.username,
	email: fieldsValidation.email,
	gender: fieldsValidation.gender,
	birthdate: fieldsValidation.birthdate,

	phone: fieldsValidation.phone,
	bio: fieldsValidation.bio,

	avatar: fieldsValidation.avatar,
	covers: fieldsValidation.covers,
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const defaultValuesProfile: ProfileInput = {
	firstName: '',
	lastName: '',
	username: '',
	email: '',
	phone: '',
	gender: 0,
	birthdate: undefined,
	bio: '',
	avatar: '',
	covers: [],
};
