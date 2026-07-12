import { deleteCookies, getCookiesTokens, setCookiesTokens } from '@/modules/auth/services/manage-cookies';
import { configEnv } from '@/shared/config/env';
import { NextResponse } from 'next/server';

export async function POST() {
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
		await deleteCookies();
		return Response.json({ error: 'Failed to refresh token' }, { status: 500 });
	}

	const result = await res.json();

	await setCookiesTokens(result.data);

	return NextResponse.json({ message: 'Refresh token found' });
}
