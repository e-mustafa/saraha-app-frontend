import { backendErrors } from '../types/index';

export class ApiError extends Error {
	status: number;
	errors?: backendErrors<unknown>;

	constructor(message: string, status: number, errors?: backendErrors<unknown>) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.errors = errors;
	}
}
