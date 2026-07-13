import { ProfileInput } from '../schemas/profile.schema';

export type UserProfile = ProfileInput & {
	_id?: string;
	id: string;
	name?: string;
	age?: number;
	avatar: string;
	covers: string[];
	visitCount: number;
	verified: null | Date;
};
