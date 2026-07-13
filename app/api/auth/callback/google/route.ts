// app\api\auth\callback\google\route.ts

import { setCookiesTokens } from '@/modules/auth/services/manage-cookies';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { configEnv } from '@/shared/config/env';
import { ApiError } from '@/shared/utils/app-error';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const code = searchParams.get('code');
	const locale = searchParams.get('state') || 'en';

	if (!code) {
		return NextResponse.redirect(new URL(`/${locale}${APP_ROUTES.login}?error=NoCode`, req.url));
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

		const tokenData = await tokenRes.json();
		const idToken = tokenData.id_token;

		// تعديل الشرط الصحيح الذي أصلحته
		if (!idToken) {
			throw new ApiError('Failed to get id_token from Google', 400);
		}

		const backendRes = await fetch(`${configEnv.apiBaseUrl}/auth/social-login/google`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ idToken }),
		});

		const backendData = await backendRes.json();

		if (!backendRes.ok || !backendData.success) {
			throw new ApiError(
				backendData.message || 'Failed to authenticate with backend',
				backendRes.status || 500,
				backendData.errors,
			);
		}

		await setCookiesTokens(backendData.data);

		//  إضافة الـ locale قبل مسار التوجيه للنجاح
		return NextResponse.redirect(new URL(`${configEnv.appUrl}/${locale}${APP_ROUTES.messages}`, req.url));
	} catch (error) {
		console.error('Google callback error:', error);

		//  استخدام NextResponse.redirect بدلاً من دالة الـ redirect العادية داخل الـ catch
		return NextResponse.redirect(
			new URL(`${configEnv.appUrl}/${locale}${APP_ROUTES.login}?error=AuthenticationFailed`, req.url),
		);
	}
}
