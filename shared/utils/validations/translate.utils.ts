import { _Translator } from 'next-intl';

export function msgKey(key: string, values?: Record<string, unknown>) {
	return JSON.stringify({
		key,
		values,
	});
}

export function tranErr(message: string, t: _Translator) {
	try {
		const parsed = JSON.parse(message);

		return t(parsed.key, parsed.values);
	} catch {
		return t(message);
	}
}
