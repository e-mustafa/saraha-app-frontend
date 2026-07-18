'use server';
import { configEnv } from '@/shared/config/env';
import { ValidateFormAction } from '@/shared/utils/validations/validation-schema';
import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { ForgetPasswordInput, forgetPasswordSchema } from './schemas/forget-password.schema';
import { LoginInput, loginSchema } from './schemas/login.schema';
import { RegisterInput, registerSchema } from './schemas/register.schema';
import { ResetPasswordInput, resetPasswordSchema } from './schemas/reset-password.schema';
import { VerifyAccountInput, verifyAccountSchema } from './schemas/verify-account.schema';
import { deleteCookies, getCookiesTokens, setCookiesTokens } from './services/manage-cookies';
import { IResponse } from './types';

const API_BASE_URL = configEnv.apiBaseUrl + '/auth';

export async function registerAction(data: RegisterInput) {
	try {
		const validationResult = await ValidateFormAction(registerSchema, data);
		if (!validationResult.success) {
			const t = await getTranslations('api.errors');
			return {
				...validationResult, // return data to show in form
				errors: { body: JSON.stringify(validationResult.errors) },
				message: t('inputs_validation'),
			};
		}

		const result = await fetch(`${API_BASE_URL}/signup`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(validationResult?.data || data),
		});

		const resultData = await result.json();
		if (!result.ok) {
			return {
				...resultData,
				success: false,
				message: resultData.message,
			};
		}

		if (!resultData.success) {
			return {
				...resultData,
				success: false,
				message: resultData.message,
			};
		}

		return {
			...resultData,
			success: true,
			message: resultData.message || 'Register successful',
		};
	} catch (error) {
		console.error('Register action error:', error);
		return {
			success: false,
			...(error as Error),
			message: error instanceof Error ? error.message : 'An error occurred during registration',
		};
	}
}

export async function verifyAccountAction(data: VerifyAccountInput & { email: string }): Promise<IResponse> {
	const validationResult = await ValidateFormAction(verifyAccountSchema, data);
	if (!validationResult.success) {
		const t = await getTranslations('api.errors');
		return {
			...validationResult, // return data to show in form
			errors: { body: JSON.stringify(validationResult.errors) },
			message: t('inputs_validation'),
		};
	}

	const result = await fetch(`${API_BASE_URL}/verify-account`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ...(validationResult?.data as VerifyAccountInput), email: data.email }),
	});

	const resultData = await result.json();
	if (!result.ok) {
		return {
			...resultData,
			success: false,
			message: resultData.message,
		};
	}

	if (!resultData.success) {
		return {
			...resultData,
			success: false,
			message: resultData.message,
		};
	}

	return {
		...resultData,
		success: true,
		message: resultData.message || 'Verify account successful',
	};
}

export async function loginAction(data: LoginInput): Promise<IResponse> {
	const validationResult = await ValidateFormAction(loginSchema, data);

	if (!validationResult.success) {
		const t = await getTranslations('api.errors');
		return {
			...validationResult,
			errors: { body: JSON.stringify(validationResult.errors) },
			message: t('inputs_validation'),
		};
	}

	const result = await fetch(`${API_BASE_URL}/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(validationResult?.data || data),
	});

	const resultData = await result.json();
	if (!result.ok) {
		return {
			success: false,
			...resultData,
			message: resultData.message || 'Login failed',
		};
	}

	if (!resultData.success) {
		return {
			success: false,
			...resultData,
			message: resultData.message || 'Login failed',
		};
	}

	await setCookiesTokens(resultData.data, { rememberMe: (validationResult?.data || data).rememberMe });

	return {
		success: true,
		message: resultData.message || 'Login successful',
	};
}

export async function loginWithGoogleAction(redirectTo?: string) {
	const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
	const currentLocale = await getLocale();

	const options = {
		redirect_uri: redirectTo || `${configEnv.appUrl}/api/auth/callback/google`,
		client_id: configEnv.googleClientId,
		access_type: 'online',
		response_type: 'code',
		prompt: 'select_account',
		state: currentLocale,
		scope: [
			'openid', // to get google idToken
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email',
		].join(' '),
	};

	const query = new URLSearchParams(options).toString();
	return redirect(`${rootUrl}?${query}`);
	// return `${rootUrl}?${query}`;
}

export async function forgetPasswordAction(data: ForgetPasswordInput): Promise<IResponse> {
	const validationResult = await ValidateFormAction(forgetPasswordSchema, data);

	if (!validationResult.success) {
		const t = await getTranslations('api.errors');
		return {
			...validationResult,
			errors: { body: JSON.stringify(validationResult.errors) },
			message: t('inputs_validation'),
		};
	}

	const result = await fetch(`${API_BASE_URL}/forget-password`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(validationResult?.data || data),
	});

	const resultData = await result.json();
	if (!result.ok) {
		return {
			success: false,
			...resultData,
			message: resultData.message || 'Forget password failed',
		};
	}

	if (!resultData.success) {
		return {
			success: false,
			...resultData,
			message: resultData.message || 'Forget password failed',
		};
	}

	return {
		success: true,
		...resultData,
		message: resultData.message || 'Forget password successful',
	};
}

export async function resetPasswordAction(data: ResetPasswordInput): Promise<IResponse> {
	const validationResult = await ValidateFormAction(resetPasswordSchema, data);

	if (!validationResult.success) {
		const t = await getTranslations('api.errors');
		return {
			...validationResult,
			errors: { body: JSON.stringify(validationResult.errors) },
			message: t('inputs_validation'),
		};
	}

	const { token, password } = (validationResult?.data || data) as ResetPasswordInput;

	const result = await fetch(`${API_BASE_URL}/reset-password`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ token, password }),
	});

	const resultData = await result.json();
	if (!result.ok) {
		return {
			success: false,
			...resultData,
			message: resultData.message || 'Reset password failed',
		};
	}

	if (!resultData.success) {
		return {
			success: false,
			...resultData,
			message: resultData.message || 'Reset password failed',
		};
	}

	return {
		success: true,
		...resultData,
		message: resultData.message || 'Reset password successful',
	};
}

// export async function changePasswordAction(data: ChangePasswordInput): Promise<IResponse> {
// 	const validationResult = await ValidateFormAction(changePasswordSchema, data);

// 	if (!validationResult.success) {
//			const t = await getTranslations('api.errors');
// 		return {
// 			...validationResult,
// 			errors: JSON.stringify(validationResult.errors),
// 			message: 'api.errors.inputs_validation',
// 		};
// 	}

// 	const { oldPassword, newPassword, isConfirmed } = (validationResult?.data || data) as ChangePasswordInput;

// 	try {
// 		// نستخدم الـ serverFetch المركزي هنا بدلاً من الـ fetch العادي
// 		const response = await serverFetch('/change-password', {
// 			method: 'POST',
// 			body: JSON.stringify({ oldPassword, newPassword, isConfirmed }),
// 		});

// 		const resultData = await response.json();

// 		if (!response.ok || !resultData.success) {
// 			return {
// 				success: false,
// 				...resultData,
// 				message: resultData.message || 'Change password failed',
// 			};
// 		}

// 		return {
// 			success: true,
// 			...resultData,
// 			message: resultData.message || 'Change password successful',
// 		};
// 	} catch (error) {
// 		console.error('Action Error:', error);
// 		if (error.message === 'SESSION_EXPIRED') {
// 			return { success: false, message: 'session.expired_please_login' };
// 		}
// 		return { success: false, message: 'Server connection error' };
// 	}
// }

export async function logoutAction(fromAll = false): Promise<IResponse> {
	try {
		const { accessToken, refreshToken } = await getCookiesTokens();

		// Trigger server-side revocation
		const result = await fetch(`${API_BASE_URL}/${fromAll ? 'logout-all' : 'logout'}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
				cookie: `refreshToken=${refreshToken}`,
			},
		});

		const resultData = await result.json().catch(() => ({}));

		// CRITICAL SAFEGUARD: Always wipe local cookies even if the backend node is down (500) or unreachable
		await deleteCookies();

		if (!result.ok || resultData.success === false) {
			return {
				success: false,
				message: resultData.message || 'Server session clearing failed, local session destroyed successfully.',
			};
		}

		return {
			success: true,
			message: resultData.message || 'Logged out successfully',
		};
	} catch (error: unknown) {
		console.error('Logout Action Catastrophic Error:', error);

		// Secondary fallback execution to guarantee local security clearance
		try {
			await deleteCookies();
		} catch (cookieError) {
			console.error('Failed to clear cookies in fallback node:', cookieError);
		}

		return {
			success: false,
			message: (error as Error).message || 'An unexpected error occurred during logout clearance',
		};
	}
}
