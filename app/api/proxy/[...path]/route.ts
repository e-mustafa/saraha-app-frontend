import { getCookiesTokens } from '@/modules/auth/services/manage-cookies';
import { configEnv } from '@/shared/config/env';
import { NextRequest, NextResponse } from 'next/server';

async function handleProxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
	const { accessToken } = await getCookiesTokens();

	// Resolve dynamic route parameters (Next.js 15+ async params)
	const resolvedParams = await params;
	const apiPath = resolvedParams.path.join('/');
	const searchParams = request.nextUrl.search; // Preserves query params like ?page=1

	const backendUrl = `${configEnv.apiBaseUrl}/${apiPath}${searchParams}`;

	// Clone incoming headers from the browser
	const headers = new Headers(request.headers);

	// Server-side magic: Swap secure HTTP-only cookie for a Bearer Token
	if (accessToken) {
		headers.set('Authorization', `Bearer ${accessToken}`);
	}

	// Delete the host header to prevent CORS issues with the backend API
	headers.delete('host');

	// ⚡ Optimization: Tell the backend NOT to compress the response.
	// Node's native fetch auto-decompresses anyway, so compressing/decompressing
	// between proxy and backend is just wasted server CPU cycles.
	headers.delete('accept-encoding');

	// Check if the request method typically includes a payload body
	const hasBody = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);

	try {
		const response = await fetch(backendUrl, {
			method: request.method,
			headers,
			// Forward the request body directly as a stream for maximum memory efficiency
			body: hasBody ? request.body : undefined,
			// @ts-expect-error - 'duplex' property is required in Node.js when forwarding a request stream
			duplex: hasBody ? 'half' : undefined,
		});

		// If backend returns 401, return a clean unauthorized JSON for your client-side apiClient to trigger refresh flow
		if (response.status === 401) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Forward backend response headers
		const responseHeaders = new Headers(response.headers);

		// ⚠️ Fix: Since Node's fetch already decompressed the body, forwarding these headers
		// will confuse the client browser, causing ERR_CONTENT_DECODING_FAILED.
		responseHeaders.delete('content-encoding');
		responseHeaders.delete('content-length');

		// Directly stream the backend response body back to the client
		return new NextResponse(response.body, {
			status: response.status,
			headers: responseHeaders,
		});
	} catch (error) {
		console.error('Proxy Error:', error);
		return NextResponse.json({ message: 'Internal Proxy Error', error }, { status: 500 });
	}
}

// Support all standard HTTP methods
export { handleProxy as DELETE, handleProxy as GET, handleProxy as PATCH, handleProxy as POST, handleProxy as PUT };
