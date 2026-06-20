import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'ar'];

export default getRequestConfig(async ({ locale, requestLocale }) => {
	const lang = locale || (await requestLocale);

	if (!lang || !locales.includes(lang)) {
		notFound();
	}

	return {
		locale: lang,
		messages: (await import(`../messages/${lang}.json`)).default,
	};
});
