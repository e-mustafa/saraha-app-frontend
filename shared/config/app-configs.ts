export const APP_CONFIGS = {
	name: 'Saraha App',
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

	changeEmail: '/auth/change-email',
	revertEmail: '/auth/revert-email',

	// user routes
	profile: '/user/profile',
	messages: '/user/messages',
	settings: '/user/settings',
	changePassword: '/user/change-password',
	requestChangeEmail: '/user/request-change-email',

	// visitor routes
	visitor: '/u',
};

export const tokenOptions = {
	httpOnly: true,
	secure: true,
	sameSite: 'lax' as const,
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
		maxAttachmentSize: 2 * 1024 * 1024, // 10MB

		maxMessagesPerMinute: 10,
	},
	user: {
		coversMaxCount: 2,
		coversMaxSize: 2 * 1024 * 1024, // 2MB
	},
	security: {
		minPasswordLength: 8,
	},
};
