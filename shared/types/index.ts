export enum ProvidersEnum {
	LOCAL = 'system',
	GOOGLE = 'google',
}

export enum UserRolesEnum {
	USER = 'USER',
	ADMIN = 'ADMIN',
}

export interface IMetadata {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	limit: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

export type FieldsError<T> = Partial<Record<keyof T, string | string[]>>;
export type backendErrors<T> = { [key: string]: FieldsError<T> };

export interface IResponse<T = unknown> {
	success: boolean;
	message?: string;
	data?: T | T[];
	// errors?: Record<string, string | string[]>;
	errors?: backendErrors<T>; //| FieldsError<T>;
	metadata?: IMetadata;
}

// export interface User {
// 	id: string; // Maps to Mongoose _id
// 	firstName: string;
// 	lastName: string;
// 	username: string;
// 	email: string;
// 	confirmedEmail: string | null; // Date string or null
// 	isActive: boolean;
// 	phone?: string;
// 	gender: number; // Mapped to GENDERS enum
// 	birthdate?: string; // Date string
// 	description?: string;
// 	role: UserRolesEnum;
// 	provider: ProvidersEnum;
// 	createdAt: string;
// 	updatedAt: string;
// 	// Virtuals
// 	fullName: string;
// 	age?: number;
// 	avatar?: string;
// }

// export interface Message {
// 	id: string;
// 	content: string;
// 	image?: string;
// 	from: string | Partial<User>; // ObjectId Reference
// 	to: string | Partial<User>; // ObjectId Reference
// 	createdAt: string;
// }

// export interface IResponse<T = unknown> {
// 	success?: boolean;
// 	token?: string;
// 	message?: string;
// 	errors?: string;
// 	errors?: Record<string, string>;
// 	data?: T;
// }

// export interface AuthResponse<T = unknown> {
// 	success: boolean;
// 	token?: string;
// 	message?: string;
// 	errors?: string;
// 	errors?: Record<string, string>;
// 	data?: T;
// }

// export interface LoginInput {
// 	email: string;
// 	password: string;
// }

// export interface RegisterInput {
// 	email: string;
// 	password: string;
// 	confirmPassword: string;
// 	firstName: string;
// 	lastName: string;
// 	username: string;
// }

// export interface UpdateProfileInput {
// 	firstName?: string;
// 	lastName?: string;
// 	username?: string;
// 	phone?: string;
// 	gender?: number;
// 	birthdate?: string;
// 	avatar?: string;
// 	bio?: string;
// }

// export interface SendMessageInput {
// 	content: string;
// 	image?: string;
// 	recipientUsername: string;
// }
