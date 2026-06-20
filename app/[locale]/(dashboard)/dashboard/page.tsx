import { useTranslations } from 'next-intl';

export default function DashboardPage() {
	const t = useTranslations('dashboard');

	return (
		<div className="min-h-full">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold tracking-tight text-foreground">{t('messages')}</h1>
				<p className="mt-4 text-gray-500">Your messages will appear here.</p>
			</div>
		</div>
	);
}
