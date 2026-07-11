import { _Translator } from 'next-intl';
import { ZodErrorMap } from 'zod';

export const getZodErrorMap =
	(t: _Translator<Record<string, any>, never>): ZodErrorMap =>
	(issue, ctx) => {
		let message = ctx.defaultError;

		switch (issue.code) {
			case 'invalid_type':
				message = t('zod.errors.invalid_type');
				break;

			case 'invalid_string':
				if (issue.validation === 'email') message = t('zod.errors.invalid_string.email');
				if (issue.validation === 'url') message = t('zod.errors.invalid_string.url');
				break;

			case 'too_small':
				if (issue.type === 'string') {
					message = t('zod.errors.too_small.string', { minimum: issue.minimum });
				}
				break;

			case 'too_big':
				if (issue.type === 'string') {
					message = t('zod.errors.too_big.string', { maximum: issue.maximum });
				}
				break;
		}

		return { message };
	};
