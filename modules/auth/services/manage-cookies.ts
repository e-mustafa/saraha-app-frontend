// @/modules/auth/services/manage-cookies.ts
import { tokenOptions } from '@/shared/config/app-configs';
import { configEnv } from '@/shared/config/env';
import { cookies } from 'next/headers';

const configTokens = configEnv.tokens;

export type TokensType = {
	refreshToken: string;
	refreshExpiration: number;
	accessToken: string;
	accessExpiration: number;
	tokenId: string;
};

export type CookiesTokens = {
	accessToken: string;
	refreshToken: string;
	tokenId: string;
};

// Standard cookie options interface matching Next.js native attributes structurally
export interface CookieOptions {
	httpOnly?: boolean;
	secure?: boolean;
	sameSite?: 'strict' | 'lax' | 'none' | boolean;
	maxAge?: number;
	path?: string;
	domain?: string;
	expires?: number | Date;
}

// Structurally compatible interfaces with Next.js RequestCookies, ResponseCookies, and ReadonlyRequestCookies
export interface WritableCookieStore {
	set(name: string, value: string, options?: CookieOptions): unknown;
	delete(name: string): unknown;
}

export interface ReadableCookieStore {
	get(name: string): { value: string } | undefined;
}

/**
 * Sets auth tokens into cookies. Supports custom cookie jars (like NextResponse.cookies for Middleware/Route Handlers).
 */
export const setCookiesTokens = async (
	data: TokensType,
	options?: { rememberMe?: boolean; store?: WritableCookieStore },
) => {
	const { rememberMe = false, store } = options || {};
	const { refreshToken, refreshExpiration, accessToken, accessExpiration, tokenId } = data || {};
	const cookiePeriod = refreshExpiration || configTokens.exp.refreshToken;

	const defaultOptions: CookieOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax' as const,
	};

	const baseOptions: CookieOptions = {
		...(tokenOptions || defaultOptions),
		maxAge: rememberMe ? cookiePeriod * 2 : cookiePeriod,
	};

	try {
		// Fallback to next/headers cookies() if no custom store is provided (Server Actions / Server Components)
		const dataStore = store || (await cookies());

		if (accessToken) {
			dataStore.set(configTokens.keys.accessToken, accessToken, {
				...baseOptions,
				maxAge: accessExpiration || configTokens.exp.accessToken,
			});
		}
		if (refreshToken) {
			dataStore.set(configTokens.keys.refreshToken, refreshToken, baseOptions);
		}
		if (tokenId) {
			dataStore.set(configTokens.keys.tokenId, tokenId, baseOptions);
		}
	} catch (error) {
		console.error('Error setting cookie tokens:', error);
	}
};

/**
 * Deletes auth cookies from the specified or default cookie store.
 */
export async function deleteCookies(keys: string[] = Object.values(configTokens.keys), store?: WritableCookieStore) {
	try {
		const dataStore = store || (await cookies());
		keys.forEach((key) => dataStore.delete(key));
	} catch (error) {
		console.error('Error deleting cookies:', error);
	}
}

/**
 * Retrieves all core auth tokens from the specified or default cookie store.
 */
export async function getCookiesTokens(store?: ReadableCookieStore): Promise<CookiesTokens> {
	try {
		const dataStore = store || (await cookies());

		return {
			accessToken: dataStore.get(configTokens.keys.accessToken)?.value || '',
			refreshToken: dataStore.get(configTokens.keys.refreshToken)?.value || '',
			tokenId: dataStore.get(configTokens.keys.tokenId)?.value || '',
		};
	} catch (error) {
		console.error('Error getting cookie tokens:', error);
		return {
			accessToken: '',
			refreshToken: '',
			tokenId: '',
		};
	}
}
