import { setCookiesTokens } from '@/modules/auth/services/manage-cookies';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { configEnv } from '@/shared/config/env';
import { ApiError } from '@/shared/utils/app-error';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const code = searchParams.get('code');
	const locale = searchParams.get('state') || 'en';

	if (!code) {
		return NextResponse.redirect(new URL(`/${locale}${APP_ROUTES.login}?error=NoCode`, configEnv.appUrl));
	}

	try {
		const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				code,
				client_id: configEnv.googleClientId,
				client_secret: configEnv.googleClientSecret,
				redirect_uri: `${configEnv.appUrl}/api/auth/callback/google`,
				grant_type: 'authorization_code',
			}),
		});

		if (!tokenRes.ok) {
			throw new ApiError('Failed to fetch token from Google', tokenRes.status);
		}

		const tokenData = await tokenRes.json();
		const idToken = tokenData.id_token;

		if (!idToken) {
			throw new ApiError('Failed to get id_token from Google API', 400);
		}

		const backendRes = await fetch(`${configEnv.apiBaseUrl}/auth/social-login/google`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ idToken }),
		});

		const contentType = backendRes.headers.get('content-type');
		if (!backendRes.ok || !contentType || !contentType.includes('application/json')) {
			const fallbackText = await backendRes.text().catch(() => 'Backend internal error');
			throw new ApiError(fallbackText || 'Invalid backend server response', backendRes.status || 500);
		}

		const backendData = await backendRes.json();

		if (!backendData.success) {
			throw new ApiError(
				backendData.message || 'Failed to authenticate with backend',
				backendRes.status || 500,
				backendData.errors,
			);
		}

		// await setCookiesTokens(backendData.data);

		// 1. Initialize the redirect response targeting the absolute environment application URL
		const successRedirectUrl = new URL(`/${locale}${APP_ROUTES.messages}`, configEnv.appUrl);
		const response = NextResponse.redirect(successRedirectUrl);

		await setCookiesTokens(backendData.data, { store: response.cookies });

		// const cookieOptions = {
		// 	httpOnly: true,
		// 	secure: true,
		// 	sameSite: 'lax' as const,
		// };

		// const { accessToken, refreshToken, tokenId, accessExpiration, refreshExpiration } = backendData.data;

		// if (accessToken) {
		// 	response.cookies.set(configEnv.tokens.keys.accessToken, accessToken, {
		// 		...cookieOptions,
		// 		maxAge: accessExpiration || 60 * 15,
		// 	});
		// }
		// if (refreshToken) {
		// 	response.cookies.set(configEnv.tokens.keys.refreshToken, refreshToken, {
		// 		...cookieOptions,
		// 		maxAge: refreshExpiration || 60 * 60 * 24 * 7,
		// 	});
		// }
		// if (tokenId) {
		// 	response.cookies.set(configEnv.tokens.keys.tokenId, tokenId, cookieOptions);
		// }

		// 2. Mutate the response object's cookies store explicitly to guarantee continuous injection
		// await setCookiesTokens(backendData.data, { store: response.cookies });

		return response;
	} catch (error) {
		console.error('Google callback critical error:', error);

		const errorRedirectUrl = new URL(`/${locale}${APP_ROUTES.login}?error=AuthenticationFailed`, configEnv.appUrl);
		return NextResponse.redirect(errorRedirectUrl);
	}
}
