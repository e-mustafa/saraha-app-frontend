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

export const getFromCookies = async (key = 'access-token'): Promise<string | undefined> => {
	try {
		const cookieStore = await cookies();
		return cookieStore.get(key)?.value;
	} catch (error) {
		console.error('Error fetching cookie:', error);
		return undefined;
	}
};

export const setCookiesTokens = async (data: TokensType, rememberMe = false) => {
	'use server';
	console.log('setCookiesTokens data', data);
	const { refreshToken, refreshExpiration, accessToken, accessExpiration, tokenId } = data || {};
	const cookiePeriod = refreshExpiration || configTokens.exp.refreshToken;

	const cookieOptions = {
		httpOnly: true,
		secure: true,
		sameSite: 'strict' as const,
		// maxAge: rememberMe ? cookiePeriod * 2 : cookiePeriod, // 14 days or 7 days
	};
	const options = {
		...(tokenOptions || cookieOptions),
		maxAge: rememberMe ? cookiePeriod * 2 : cookiePeriod, // 14 days or 7 days
	};

	try {
		const cookiesStore = await cookies();
		if (accessToken) {
			cookiesStore.set(configTokens.keys.accessToken, accessToken, {
				...options,
				maxAge: accessExpiration || configTokens.exp.accessToken,
			});
		}
		if (refreshToken) {
			cookiesStore.set(configTokens.keys.refreshToken, refreshToken, options);
		}
		if (tokenId) {
			cookiesStore.set(configTokens.keys.tokenId, tokenId, options);
		}
	} catch (error) {
		console.error('Error set cookies tokens', error);
	}
};

export async function deleteCookies(keys: string[] = Object.values(configTokens.keys)) {
	'use server';
	try {
		const cookiesStore = await cookies();
		keys.forEach((key) => cookiesStore.delete(key));
	} catch (error) {
		console.error('Error delete cookie', error);
	}
}

export async function getCookiesTokens(): Promise<CookiesTokens> {
	'use server';
	try {
		const cookiesStore = await cookies();

		return {
			accessToken: cookiesStore.get(configTokens.keys.accessToken)?.value || '',
			refreshToken: cookiesStore.get(configTokens.keys.refreshToken)?.value || '',
			tokenId: cookiesStore.get(configTokens.keys.tokenId)?.value || '',
		};
	} catch (error) {
		console.error('Error get cookies tokens', error);
		return {
			accessToken: '',
			refreshToken: '',
			tokenId: '',
		};
	}
}

// export async function getCookies<T extends string>(
// 	keys: T[] = (Object.values(configTokens.keys) as T[]) || [],
// ): Promise<Record<T, string>> {
// 	'use server';
// 	const cookiesStore = await cookies();

// 	const data = {} as Record<T, string>;
// 	const formatKey = (key: T) => {
// 		if (key.includes('')) {
// 			// return key.split('-').map((e, i)=> )
// 			return key
// 				.split('-')
// 				.reduce((acc: string, e: string, i: number) =>
// 					acc.concat(i > 0 ? `${e.charAt(0).toUpperCase}${e.slice(1).toLowerCase}` : e),
// 				);
// 		}
// 	};

// 	keys.forEach((key) => (data[formatKey(key) as T] = cookiesStore.get(key)?.value || ''));

// 	console.log('tokens data', data);

// 	return data;
// }
