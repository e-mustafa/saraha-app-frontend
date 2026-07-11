export const APP_CONFIGS = {
	name: 'Saraha',
	version: '1.0.0',
	description: 'Saraha App Frontend',
};

export const APP_ROUTES = {
	home: '/',
	// auth routes
	login: '/auth/login',
	register: '/auth/register',
	verifyAccount: '/auth/verify-account',
	forgetPassword: '/auth/forget-password',
	
	// user routes
	profile: '/user/profile',
	messages: '/user/messages',
	settings: '/user/settings',
	changePassword: '/user/change-password',
	changeEmail: '/user/change-email',
	
	// visitor routes
	visitor: '/u',
};

export const tokenOptions = {
	httpOnly: true,
	secure: true,
	sameSite: 'strict' as const,
	maxAge: 60 * 60 * 15, // 15 minutes
};

export const defaultImages = {
	avatarMale: '/images/placeholders/user-avatar-placeholder-male.webp',
	avatarFemale: '/images/placeholders/user-avatar-placeholder-female.webp',
	cover: '/images/placeholders/user-cover-placeholder.webp',
};

export const appConfig = {
	messages: {
		maxLength: 1000,
		maxAttachmentsPer: 4,
		maxAttachmentSize: 10 * 1024 * 1024, // 10MB

		maxMessagesPerMinute: 10,
	},
	security: {
		minPasswordLength: 8,
	},
};
