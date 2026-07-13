import { ProfileInput } from '../schemas/profile.schema';

export type UserProfile = ProfileInput & {
	_id?: string;
	id: string;
	name?: string;
	age?: number;
	visitCount: number;
	verified: null | Date
};
