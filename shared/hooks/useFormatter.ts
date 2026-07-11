import { useFormatter, useNow } from 'next-intl';

export function useFormatDate(date: string | Date, type: 'all' | 'date' | 'time' | 'dateTime' = 'all') {
	const format = useFormatter();
	const dateTime = new Date(date);

	const formattedDate: { date?: string; time?: string; dateTime?: string } = {};

	// Renders "Nov 20, 2020"
	if (type === 'all' || type.includes('date')) {
		formattedDate.date = format.dateTime(dateTime, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}

	// Renders "11:36 AM"
	if (type === 'all' || type.includes('time')) {
		formattedDate.time = format.dateTime(dateTime, { hour: 'numeric', minute: 'numeric' });
	}

	// Full date and time "Nov 20, 2020, 11:36 AM"
	if (type === 'all' || type.includes('dateTime')) {
		formattedDate.dateTime = format.dateTime(dateTime, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		});
	}

	return formattedDate;
}

export function useRelativeDate(date: string | Date) {
	const now = useNow({
		// … and update it every 1 minute
		updateInterval: 1000 * 60,
	});
	const format = useFormatter();
	const dateTime = new Date(date);

	return format.relativeTime(dateTime, now);
}
