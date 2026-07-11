'use client';

import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { ChevronDownIcon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { arSA as arSADayPicker } from 'react-day-picker/locale';

// const dayPickerLocales = {
// 	ar: arSADayPicker,
// 	en: enUSDayPicker,
// } as const;

// const dateFnsLocales = {
// 	ar: arSA,
// 	en: enUS,
// } as const;

export function DatePicker({ value, onChange }: { value?: Date | string; onChange?: (date: Date | undefined) => void }) {
	const t = useTranslations();
	// const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined);
	const locale = useLocale();
	const [dir] = useState<'ltr' | 'rtl'>(locale == 'ar' ? 'rtl' : 'ltr');
	console.log('locale', locale);

	// const dateFnsLocale = locale === 'ar' ? dateFnsLocales[locale as keyof typeof dateFnsLocales] : undefined;
	// const dayPickerLocale = locale === 'ar' ? arSADayPicker : undefined;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					data-empty={!value}
					className='w-full h-10 ps-10 justify-between text-left font-normal data-[empty=true]:text-muted-foreground'
					dir={dir}
				>
					{value ? (
						format(new Date(value), 'PPP', { locale: locale === 'ar' ? arSA : undefined })
					) : (
						<span>{t('forms.placeholders.birthdate')}</span>
					)}
					<ChevronDownIcon />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0' align='start' dir={dir}>
				<Calendar
					mode='single'
					selected={value ? new Date(value) : undefined}
					onSelect={onChange}
					defaultMonth={value ? new Date(value) : undefined}
					dir={dir}
					locale={locale === 'ar' ? arSADayPicker : undefined}
					required={false}
				/>
			</PopoverContent>
		</Popover>
	);
}
