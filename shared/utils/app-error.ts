export class ApiError extends Error {
	status: number;
	errors?: Record<string, string>; // أو حسب شكل الأخطاء القادمة من الباك إند لديك

	constructor(message: string, status: number, errors?: Record<string, string>) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.errors = errors;
	}
}
