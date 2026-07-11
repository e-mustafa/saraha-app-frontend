import { format, formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale'; // يُفضل استخدام ar العامة لدعم أفضل للوقت النسبي
import { useLocale } from 'next-intl';

export const useFormatDate = () => {
	const locale = useLocale();
	// تحديد حزمة اللغة الممررة لـ date-fns
	const dateLocale = locale === 'ar' ? ar : undefined;

	// أضفنا خياراً اختياريّاً (relative) لتحديد نوع الصيغة المطلوبة
	return (date: Date | string, relative = false) => {
		const dateObj = new Date(date);

		if (relative) {
			return formatDistanceToNow(dateObj, {
				locale: dateLocale,
				addSuffix: true,
			});
		}

		// إذا لم نطلب الوقت النسبي، يعود للصيغة العادية الافتراضية
		return format(dateObj, 'PPP', { locale: dateLocale });
	};
};
