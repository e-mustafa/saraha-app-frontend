import { deleteCookies, getCookiesTokens, setCookiesTokens } from '@/modules/auth/services/manage-cookies';
import { configEnv } from '@/shared/config/env';
import { NextResponse } from 'next/server';

export async function POST() {
	// const cookiesStor = await cookies();
	// const refreshToken = cookiesStor.get('refresh-token')?.value;
	const { refreshToken } = await getCookiesTokens();
	if (!refreshToken) {
		return NextResponse.json({ error: 'No refresh token found' }, { status: 401 });
	}

	const res = await fetch(`${configEnv.apiBaseUrl}/auth/refresh-token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			// 'Authorization': `Bearer ${refreshToken}`,
			// Cookie: cookiesStor.toString(),
			Cookie: `refreshToken=${refreshToken}`,
		},
	});

	if (!res.ok) {
		// cookiesStor.delete('access-token');
		// cookiesStor.delete('refresh-token');

		await deleteCookies();

		return Response.json({ error: 'Failed to refresh token' }, { status: 500 });
	}

	const result = await res.json();
	console.log('Refresh token result:', result);

	// cookiesStor.set('access-token', result.data?.accessToken, {
	// 	...tokenOptions,
	// 	maxAge: result.data?.accessExpiration || 60 * 60 * 15, // 15 minutes
	// });
	// if (result.data?.refreshToken)
	// 	cookiesStor.set('refresh-token', result.data?.refreshToken, {
	// 		...tokenOptions,
	// 		maxAge: result.data?.refreshExpiration || 60 * 60 * 24 * 7 * 2, // 7 days
	// 	});

	await setCookiesTokens(result.data);

	return NextResponse.json({ message: 'Refresh token found' });
}
