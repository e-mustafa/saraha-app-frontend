import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from './routing';

// const locales = ['en', 'ar'];

export default getRequestConfig(async ({ requestLocale }) => {
	const requested = await requestLocale;
	const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

	// const store = await cookies();
	// const localeFromStore = store.get('locale')?.value;
	// console.log('localeFromStore', localeFromStore);
	// const lang = locale || localeFromStore || (await requestLocale) || 'en';

	// if (!locale || !locales.includes(locale)) {
	if (!locale) {
		// || !locales.includes(locale)) {
		notFound();
	}

	return {
		locale: locale,
		messages: (await import(`../locales/${locale}.json`)).default,
	};
});
