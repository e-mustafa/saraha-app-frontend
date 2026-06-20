export const configEnv = {
	appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000',
	apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
	environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
	enableMocks: process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true',

	// Add more environment variables here as needed
};

export const isDev = configEnv.environment === 'development';
// export const isProd = configEnv.environment === 'production';
// export const isStaging = configEnv.environment === 'staging';
