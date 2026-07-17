import { ProfileInput } from '../schemas/profile.schema';

export type UserImage = {
	id: string;
	url: string;
};

export type UserProfile = ProfileInput & {
	_id?: string;
	id: string;
	name?: string;
	age?: number;
	avatar: UserImage;
	covers: UserImage[];
	visitCount: number;
	verified: null | Date;
};
