import { MessageTypeEnum } from '../enums';

export interface MessageMedia {
	id: string;
	type: 'image' | 'video';
	url: string;
}

export type Person = {
	id: string;
	avatar: string;
	name: string;
	username: string;
	isLive: boolean;
};

export interface Message {
	id: string;
	content: string;
	createdAt?: string;
	attachments?: MessageMedia[];
	toFavorite?: boolean;
	fromFavorite?: boolean;
	from?: Person;
	to?: Person;
	// isConfidential?: boolean;
	isPublic?: boolean;
	isAnonymous?: boolean;

	// likesCount?: number;
}

// export interface Message {
// 	id: string;
// 	content: string;
// 	image?: string;
// 	from: string | Partial<User>; // ObjectId Reference
// 	to: string | Partial<User>; // ObjectId Reference
// 	createdAt: string;
// }

export type MessageType = (typeof MessageTypeEnum)[keyof typeof MessageTypeEnum];
