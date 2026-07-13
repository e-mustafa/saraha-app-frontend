'use client';

import { useRouter } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { APP_ROUTES } from '@/shared/config/app-configs';
import { ArrowRightIcon, MessageSquareShareIcon, ShieldCheckIcon, SparklesIcon, UsersIcon, ZapIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function HomePage() {
	const t = useTranslations();
	const router = useRouter();

	return (
		<div className='relative min-h-screen w-full overflow-hidden pb-20'>
			{/* خلفية جمالية متدرجة مع تأثير زجاجي يتطابق مع الملف الشخصي */}
			<div className='absolute inset-0 -z-10 bg-radial from-brand-primary/10 via-transparent to-transparent opacity-70 blur-3xl' />

			{/* Hero Section - القسم الرئيسي للترحيب */}
			<div className='container mx-auto px-6 pt-24 pb-16 text-center max-w-4xl relative'>
				{/* شارة صغيرة علوية مميزة */}
				<div className='inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold mb-6 animate-pulse'>
					<SparklesIcon className='w-3.5 h-3.5' />
					<span>{t('home.badge') || 'شارك بصراحة، تواصل بعمق'}</span>
				</div>

				<h1 className='text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-tight'>
					{t('home.heroTitle') || 'احصل على نقد بناء وسري من أصدقائك'}
				</h1>

				<p className='mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
					{t('home.heroSubtitle') ||
						'منصة صراحة برو تمكنك من معرفة كيف يراك الآخرون بكل صدق وبدون إحراج. أنشئ رابطك الخاص وابدأ في استقبال الرسائل المجهولة الآن!'}
				</p>

				{/* أزرار اتخاذ القرار (Call To Action) */}
				<div className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-4'>
					<Button
						size='lg'
						className='w-full sm:w-auto h-12 px-8 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-2xl shadow-lg shadow-brand-primary/20 text-base font-bold gap-2 transition-transform duration-200 active:scale-95'
						onClick={() => router.push(APP_ROUTES.register || '/auth/register')}
					>
						<span>{t('home.cta.register') || 'أنشئ حسابك الآن'}</span>
						<ArrowRightIcon className='w-5 h-5 rtl:rotate-180' />
					</Button>

					<Button
						size='lg'
						variant='outline'
						className='w-full sm:w-auto h-12 px-8 rounded-2xl border-border/60 hover:bg-accent/40 text-base font-semibold'
						onClick={() => router.push(APP_ROUTES.login || '/auth/login')}
					>
						{t('home.cta.login') || 'تسجيل الدخول'}
					</Button>
				</div>
			</div>

			{/* قسم المميزات والخصائص (Features Section) */}
			<div className='container mx-auto px-6 mt-12 max-w-6xl'>
				<div className='text-center mb-12'>
					<h2 className='text-2xl sm:text-3.5xl font-bold text-foreground'>
						{t('home.features.title') || 'لماذا تختار صراحة برو؟'}
					</h2>
					<p className='text-muted-foreground mt-2'>
						{t('home.features.subtitle') || 'نوفر لك تجربة تواصل آمنة، تفاعلية، وسلسة بالكامل'}
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					{/* ميزة 1: السرية الكاملة */}
					<div className='p-6 sm:p-8 rounded-3xl bg-card-glass bg-linear-to-br from-accent/10 to-brand-secondary/5 border border-border/40 shadow-md hover:shadow-lg transition-all duration-300 group'>
						<div className='w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-5 group-hover:scale-110 transition-transform'>
							<ShieldCheckIcon className='w-6 h-6' />
						</div>
						<h3 className='text-lg font-bold text-foreground'>{t('home.features.1.title') || 'سرية وأمان تام'}</h3>
						<p className='text-muted-foreground text-sm mt-3 leading-relaxed'>
							{t('home.features.1.desc') ||
								'بياناتك وهوية المرسلين مشفرة بالكامل. نضمن لك بيئة سرية وآمنة للتعبير عن الرأي دون كشف الهوية.'}
						</p>
					</div>

					{/* ميزة 2: التحكم الكامل بالملف الشخصي */}
					<div className='p-6 sm:p-8 rounded-3xl bg-card-glass bg-linear-to-br from-accent/10 to-brand-secondary/5 border border-border/40 shadow-md hover:shadow-lg transition-all duration-300 group'>
						<div className='w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-5 group-hover:scale-110 transition-transform'>
							<ZapIcon className='w-6 h-6' />
						</div>
						<h3 className='text-lg font-bold text-foreground'>{t('home.features.2.title') || 'تخصيص كامل لملفك'}</h3>
						<p className='text-muted-foreground text-sm mt-3 leading-relaxed'>
							{t('home.features.2.desc') ||
								'أضف صور غلاف متعددة ككاروسيل تفاعلي، غير صورتك الشخصية، واكتب نبذة تعريفية تعبر عنك لجذب أصدقائك.'}
						</p>
					</div>

					{/* ميزة 3: سهولة المشاركة والتواصل */}
					<div className='p-6 sm:p-8 rounded-3xl bg-card-glass bg-linear-to-br from-accent/10 to-brand-secondary/5 border border-border/40 shadow-md hover:shadow-lg transition-all duration-300 group'>
						<div className='w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-5 group-hover:scale-110 transition-transform'>
							<MessageSquareShareIcon className='w-6 h-6' />
						</div>
						<h3 className='text-lg font-bold text-foreground'>{t('home.features.3.title') || 'سهولة المشاركة'}</h3>
						<p className='text-muted-foreground text-sm mt-3 leading-relaxed'>
							{t('home.features.3.desc') ||
								'بضغطة زر واحدة يمكنك نسخ رابطك الشخصي ومشاركته عبر واتساب، إنستغرام، أو سناب شات لتلقي الرسائل فوراً.'}
						</p>
					</div>
				</div>
			</div>

			{/* قسم الإحصائيات السريعة (Social Proof / Stats) */}
			<div className='container mx-auto px-6 mt-20 max-w-5xl'>
				<div className='p-8 rounded-3xl bg-linear-to-br from-brand-primary/5 via-brand-primary/10 to-transparent border border-brand-primary/10 shadow-xl flex flex-col md:flex-row items-center justify-around gap-8 text-center'>
					<div className='flex flex-col items-center'>
						<div className='p-3 rounded-full bg-brand-primary/10 text-brand-primary mb-3'>
							<UsersIcon className='w-6 h-6' />
						</div>
						<span className='text-3xl font-extrabold text-foreground'>5M+</span>
						<span className='text-xs text-muted-foreground mt-1'>{t('home.stats.users') || 'مستخدم مسجل'}</span>
					</div>

					<div className='h-px w-2/3 md:h-12 md:w-px bg-border/40' />

					<div className='flex flex-col items-center'>
						<div className='p-3 rounded-full bg-brand-primary/10 text-brand-primary mb-3'>
							<MessageSquareShareIcon className='w-6 h-6' />
						</div>
						<span className='text-3xl font-extrabold text-foreground'>100M+</span>
						<span className='text-xs text-muted-foreground mt-1'>
							{t('home.stats.messages') || 'رسالة تم إرسالها'}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
