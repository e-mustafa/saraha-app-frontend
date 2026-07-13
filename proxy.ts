import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { TokensType } from './modules/auth/services/manage-cookies';
import { APP_ROUTES } from './shared/config/app-configs';
import { configEnv } from './shared/config/env';

// Create intl middleware
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

	// 1. Determine if the user has an active session (valid existing token or successfully refreshed)
	const hasActiveSession = !!accessToken || (isRefreshed && !!newTokens?.accessToken);

	// 2. Extract locale and clean the pathname for safe matching
	const pathname = request.nextUrl.pathname;
	const segments = pathname.split('/');

	// Check if the first segment is a supported locale (e.g., 'ar' or 'en')
	const detectedLocale = routing.locales.includes(segments[1] as 'en' | 'ar') ? segments[1] : null;

	// Strip the locale prefix for easy path matching (e.g., /ar/auth/login -> /auth/login)
	const cleanPath = detectedLocale ? `/${segments.slice(2).join('/')}` : pathname;
	const normalizedPath = cleanPath.replace(/\/$/, ''); // Remove trailing slash if present

	// Define guest-only auth pages
	const authPaths = ['/auth/login', '/auth/register'];
	const isAuthPage = authPaths.includes(normalizedPath);

	// Helper function to set cookies on a response object to keep code DRY
	const applyCookiesToResponse = (resObj: NextResponse, tokens: TokensType) => {
		const cookieOptions = {
			httpOnly: true,
			secure: true,
			sameSite: 'strict' as const,
		};

		if (tokens.accessToken) {
			resObj.cookies.set(accessTokenKey, tokens.accessToken, {
				...cookieOptions,
				maxAge: tokens.accessExpiration || 60 * 15,
			});

			// Update request cookies to make the new token available server-side immediately without full reload
			request.cookies.set(accessTokenKey, tokens.accessToken);
		}
		if (tokens.refreshToken) {
			resObj.cookies.set(refreshTokenKey, tokens.refreshToken, {
				...cookieOptions,
				maxAge: tokens.refreshExpiration || 60 * 60 * 24 * 7,
			});
		}
		if (tokens.tokenId) {
			resObj.cookies.set(tokenIdKey, tokens.tokenId, cookieOptions);
		}
	};

	// 3. Redirect authenticated users away from guest-only pages
	if (hasActiveSession && isAuthPage) {
		const targetLocale = detectedLocale || routing.defaultLocale;
		// Build redirect URL preserving the active locale
		const redirectUrl = new URL(`/${targetLocale}${APP_ROUTES.messages}`, request.url);
		const redirectResponse = NextResponse.redirect(redirectUrl);

		// Crucial: If tokens were just refreshed, they must be attached to the redirect response to avoid session loss!
		if (isRefreshed && newTokens) {
			applyCookiesToResponse(redirectResponse, newTokens);
		}

		return redirectResponse;
	}

	// 4. Default path: pass request to the intl middleware
	const response = intlMiddleware(request) as NextResponse;

	// If tokens were refreshed and no redirect happened, apply cookies to the standard response
	if (isRefreshed && newTokens) {
		applyCookiesToResponse(response, newTokens);
	}

	return response;
}

export const config = {
	matcher: '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|json)).*)',
};
