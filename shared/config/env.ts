export const configEnv = {
	appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000',
	apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1',
	apiDomain: process.env.NEXT_PUBLIC_API_DOMAIN || 'http://localhost:3000',
	environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
	googleClientId: process.env.GOOGLE_CLIENT_ID || '',
	googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',

	// Add more environment variables here as needed

	tokens: {
		keys: {
			accessToken: process.env.ACCESS_TOKEN_KEY || 'access-token',
			refreshToken: process.env.REFRESH_TOKEN_KEY || 'refresh-token',
			tokenId: process.env.TOKEN_ID_KEY || 'token-id',
		},
		exp: {
			accessToken: Number(process.env.ACCESS_TOKEN_EXPIRATION) || 60 * 15,
			refreshToken: Number(process.env.REFRESH_TOKEN_EXPIRATION) || 60 * 60 * 24 * 7,
		},
	},
};

export const isDev = configEnv.environment === 'development';
// export const isProd = configEnv.environment === 'production';
// export const isStaging = configEnv.environment === 'staging';
