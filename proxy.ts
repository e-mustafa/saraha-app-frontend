// middleware.ts
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

export default async function proxy(request: NextRequest) {
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

	// 1. Determine if the user has an active session
	const hasActiveSession = !!accessToken || (isRefreshed && !!newTokens?.accessToken);

	// 2. Extract locale and clean the pathname for safe matching
	const pathname = request.nextUrl.pathname;
	const segments = pathname.split('/');

	// Check if the first segment is a supported locale (e.g., 'ar' or 'en')
	const detectedLocale = routing.locales.includes(segments[1] as 'en' | 'ar') ? segments[1] : null;

	// Strip the locale prefix for easy path matching (e.g., /ar/user/profile -> /user/profile)
	const cleanPath = detectedLocale ? `/${segments.slice(2).join('/')}` : pathname;
	const normalizedPath = cleanPath.replace(/\/$/, '') || '/'; // Remove trailing slash, fallback to '/'

	// Target language for redirects
	const targetLocale = detectedLocale || routing.defaultLocale;

	// --- Route Classifications ---
	// Guest-only pages (Should NOT be accessed by logged-in users)
	const guestOnlyPaths = ['/auth/login', '/auth/register'];
	const isGuestOnlyPage = guestOnlyPaths.includes(normalizedPath);

	// Protected pages (Requires authentication)
	const isProtectedPage =
		normalizedPath.startsWith('/user') ||
		normalizedPath === '/auth/change-password' ||
		normalizedPath === '/auth/change-email';

	// Helper function to set cookies on a response object
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

	// --- Redirection Logic ---

	// Case A: Unauthenticated user trying to access a protected page -> Redirect to Login
	if (!hasActiveSession && isProtectedPage) {
		const redirectUrl = new URL(`/${targetLocale}${APP_ROUTES.login}`, request.url);
		return NextResponse.redirect(redirectUrl);
	}

	// Case B: Authenticated user trying to access guest-only pages -> Redirect to messages/dashboard
	if (hasActiveSession && isGuestOnlyPage) {
		const redirectUrl = new URL(`/${targetLocale}${APP_ROUTES.messages}`, request.url);
		const redirectResponse = NextResponse.redirect(redirectUrl);

		if (isRefreshed && newTokens) {
			applyCookiesToResponse(redirectResponse, newTokens);
		}

		return redirectResponse;
	}

	// Default path: pass request to the next-intl middleware
	const response = intlMiddleware(request) as NextResponse;

	// If tokens were refreshed during this cycle, apply them to the response
	if (isRefreshed && newTokens) {
		applyCookiesToResponse(response, newTokens);
	}

	return response;
}

export const config = {
	// Matcher covers all localized and unlocalized page routes, ignoring api and static assets
	matcher: '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|json)).*)',
};
