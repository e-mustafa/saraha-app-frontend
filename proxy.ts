import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { TokensType } from './modules/auth/services/manage-cookies';
import { configEnv } from './shared/config/env';

// create intl middleware
const intlMiddleware = createMiddleware(routing);

const accessTokenKey = configEnv.tokens.keys.accessToken;
const refreshTokenKey = configEnv.tokens.keys.refreshToken;
const tokenIdKey = configEnv.tokens.keys.tokenId;

export async function proxy(request: NextRequest) {
	const accessToken = request.cookies.get(accessTokenKey)?.value;
	const refreshToken = request.cookies.get(refreshTokenKey)?.value;

	let newTokens: TokensType | null = null;
	let isRefreshed = false;

	// Check and update token if access token is missing and refresh token exists
	if (!accessToken && refreshToken) {
		try {
			const res = await fetch(`${configEnv.apiBaseUrl}/auth/refresh-token`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Cookie: `refreshToken=${refreshToken}`,
				},
			});

			const result = await res.json();
			if (res.ok) {
				newTokens = result?.data;
				isRefreshed = true;
			}
		} catch (error) {
			console.error('Middleware Token Refresh Failed', error);
		}
	}

	// pass request to intl middleware to generate response
	const response = intlMiddleware(request);

	// if refreshed successfully, set new cookies in response object directly
	if (isRefreshed && newTokens) {
		const cookieOptions = {
			httpOnly: true,
			secure: true,
			sameSite: 'strict' as const,
		};

		if (newTokens.accessToken) {
			response.cookies.set(accessTokenKey, newTokens.accessToken, {
				...cookieOptions,
				maxAge: newTokens.accessExpiration || 60 * 15,
			});

			// update request object to see new token immediately without page refresh
			request.cookies.set(accessTokenKey, newTokens.accessToken);
		}
		if (newTokens.refreshToken) {
			response.cookies.set(refreshTokenKey, newTokens.refreshToken, {
				...cookieOptions,
				maxAge: newTokens.refreshExpiration || 60 * 60 * 24 * 7,
			});
		}
		if (newTokens.tokenId) {
			response.cookies.set(tokenIdKey, newTokens.tokenId, cookieOptions);
		}
	}

	return response;
}

export const config = {
	// Matcher supports languages, pages, and excludes static files and API
	// matcher: ['/', '/(ar|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
	matcher: '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|json)).*)',
};
