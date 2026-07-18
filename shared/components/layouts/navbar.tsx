'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { APP_CONFIGS, APP_ROUTES, defaultImages } from '@/shared/config/app-configs';
import { GlobeIcon, LogOutIcon, MailIcon, MessageSquareIcon, PowerIcon, SettingsIcon, User2Icon } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { ThemeSwitcher } from '../theme-switcher';

export function Navbar() {
	const t = useTranslations();
	const locale = useLocale();

	// return <p>{t('count', { count: notificationsArray.length })}</p>;

	const router = useRouter();
	const pathname = usePathname();
	// const { theme: mode, setTheme: setMode } = useTheme();

	const { user, isLoading, isAuthed, logout, isLoggingOut } = useAuth();

	// حساب الصورة الافتراضية بناءً على الجنس في حال عدم رفع صورة
	const avatarUrl = user?.avatar.url || (user?.gender === 1 ? defaultImages.avatarFemale : defaultImages.avatarMale);

	// محاكاة لقائمة الإشعارات التجريبية
	// const notifications = [
	// 	{ id: 1, text: t('demo.noti1'), time: '2m ago' },
	// 	{ id: 2, text: t('demo.noti2'), time: '1h ago' },
	// ];

	// دالة تبديل اللغة الاحترافية مع الحفاظ على نفس المسار الحالي
	const toggleLanguage = () => {
		const nextLocale = locale === 'ar' ? 'en' : 'ar';
		router.replace(pathname, { locale: nextLocale });
	};

	return (
		<header className='sticky top-0 z-50 w-full border-b border-border/40 bg-card-glass backdrop-blur-md transition-all duration-300'>
			<div className='container mx-auto flex h-16 items-center justify-between px-4 sm:px-6'>
				{/* ─── الناحية الأولى: الشعار (Logo) ─── */}
				<div className='flex items-center gap-2 cursor-pointer' onClick={() => router.push(APP_ROUTES.home)}>
					<div className='relative flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primaryx drop-shadow-lg drop-shadow-accent text-primary-foreground shadow-lgx shadow-brand-primary/20'>
						{/* <span className='font-mono text-xl font-bold tracking-tighter'>S</span> */}
						<Image src='/saraha-app-logo.png' alt='Logo' width={100} height={100} />
					</div>
					<span className='hidden font-sans text-xl font-bold tracking-tight text-foreground sm:block'>
						{APP_CONFIGS.name}
						<span className='text-brand-primary'>.</span>
					</span>
				</div>

				{/* ─── Tools and User Section ─── */}
				<div className='flex items-center gap-2 sm:gap-3'>
					{/* 1. Language Switcher */}
					<Button
						variant='ghost'
						size='icon'
						className='h-9 w-9 rounded-full text-muted-foreground hover:text-foreground'
						onClick={toggleLanguage}
						title={locale === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
					>
						<GlobeIcon className='h-[1.1rem] w-[1.1rem]' />
					</Button>

					{/* 2. زر مظهر الألوان المخصص (Theme Switcher Component) */}
					<ThemeSwitcher />

					{/* 3. سويتش أنيق وجذاب للـ Light/Dark Mode */}
					{/* <Button
						variant='ghost'
						size='icon'
						className='h-9 w-9 rounded-full text-muted-foreground hover:text-foreground transition-all duration-300'
						onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
					>
						<SunIcon className='h-[1.15rem] w-[1.15rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500' />
						<MoonIcon className='absolute h-[1.15rem] w-[1.15rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-sky-400' />
					</Button> */}

					{/* خط فاصل أنيق */}
					<span className='h-5 w-px bg-border/60 mx-1' />

					{/* 4. أيقونة الرسائل (تظهر دائماً كلينك سريع) */}
					<Button
						variant='ghost'
						size='icon'
						className='relative h-9 w-9 rounded-full text-muted-foreground hover:text-foreground'
						onClick={() => router.push(APP_ROUTES.messages)}
					>
						<MessageSquareIcon className='h-[1.1rem] w-[1.1rem]' />
					</Button>

					{/* 5. أيقونة الإعدادات (تظهر دائماً كلينك سريع) */}
					{/* <Button
						variant='ghost'
						size='icon'
						className='h-9 w-9 rounded-full text-muted-foreground hover:text-foreground'
						onClick={() => router.push(APP_ROUTES.settings)}
					>
						<SettingsIcon className='h-[1.1rem] w-[1.1rem]' />
					</Button> */}

					{/* 6. دروب داون الإشعارات الديناميكية */}
					{/* <DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								className='relative h-9 w-9 rounded-full text-muted-foreground hover:text-foreground'
							>
								<BellIcon className='h-[1.1rem] w-[1.1rem]' />
								{notifications.length > 0 && (
									<span className='absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-brand-secondary animate-pulse' />
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-72 border-border/60 bg-background/95 backdrop-blur-md p-2'>
							<DropdownMenuLabel className='text-xs font-semibold px-2 py-1.5 text-muted-foreground'>
								{t('navbar.notifications.title')}
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{notifications.length > 0 ? (
								notifications.map((item) => (
									<DropdownMenuItem
										key={item.id}
										className='flex flex-col items-start gap-1 p-2.5 rounded-lg cursor-pointer focus:bg-accent/50'
									>
										<span className='text-sm font-medium text-foreground'>{item.text}</span>
										<span className='text-[10px] text-muted-foreground'>{item.time}</span>
									</DropdownMenuItem>
								))
							) : (
								<div className='py-6 text-center text-sm text-muted-foreground'>
									{t('navbar.notifications.empty')}
								</div>
							)}
						</DropdownMenuContent>
					</DropdownMenu> */}

					{/* 7. دروب داون ملف المستخدم (الملف الشخصي / تسجيل الدخول) */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								className='relative h-9 w-9 rounded-full ring-2 ring-offset-2 ring-brand-primary/10 hover:ring-brand-primary/30 transition-all p-0'
							>
								<Avatar className='h-9 w-9'>
									<AvatarImage src={isAuthed ? avatarUrl : ''} />
									<AvatarFallback className='bg-brand-primary/10 text-brand-primary text-xs font-bold'>
										{user?.name ? user.name.substring(0, 2).toUpperCase() : <User2Icon className='h-4 w-4' />}
									</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>

						<DropdownMenuContent
							align='end'
							className='w-60 mx-4 border-border/60 bg-background/95 backdrop-blur-md p-1.5 shadow-xl'
						>
							{user ? (
								<>
									{/* في حالة تسجيل الدخول */}
									<div className='flex items-center gap-2.5 p-2.5'>
										<Avatar className='h-9 w-9'>
											<AvatarImage src={avatarUrl} />
											<AvatarFallback className='bg-brand-primary/10 text-brand-primary font-bold'>
												{(user?.name || `${user.firstName || ''} ${user.lastName || ''}`)
													.substring(0, 2)
													.toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className='flex flex-col space-y-0.5'>
											<p className='text-sm font-semibold tracking-tight text-foreground'>
												{user?.name || `${user.firstName || ''} ${user.lastName || ''}`}
											</p>
											<p className='text-xs text-muted-foreground truncate max-w-[150px]'>@{user.username}</p>
										</div>
									</div>
									<DropdownMenuSeparator />

									<DropdownMenuItem
										onClick={() => router.push(APP_ROUTES.profile)}
										className='flex items-center gap-2 py-2 cursor-pointer rounded-md'
									>
										<User2Icon className='h-4 w-4 text-muted-foreground' />
										<span className='text-sm'>{t('navbar.userMenu.profile')}</span>
									</DropdownMenuItem>

									<DropdownMenuItem
										onClick={() => router.push(APP_ROUTES.messages)}
										className='flex items-center gap-2 py-2 cursor-pointer rounded-md'
									>
										<MailIcon className='h-4 w-4 text-muted-foreground' />
										<span className='text-sm'>{t('navbar.userMenu.messages')}</span>
									</DropdownMenuItem>

									<DropdownMenuItem
										onClick={() => router.push(APP_ROUTES.settings)}
										className='flex items-center gap-2 py-2 cursor-pointer rounded-md'
									>
										<SettingsIcon className='h-4 w-4 text-muted-foreground' />
										<span className='text-sm'>{t('navbar.userMenu.settings')}</span>
									</DropdownMenuItem>

									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => logout(false)}
										disabled={isLoggingOut}
										className='flex items-center gap-2 py-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer rounded-md'
									>
										<PowerIcon className='h-4 w-4' />
										<span className='text-sm font-medium'>{t('navbar.userMenu.logout')}</span>
									</DropdownMenuItem>

									<DropdownMenuItem
										onClick={() => logout(true)}
										disabled={isLoggingOut}
										className='flex items-center gap-2 py-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer rounded-md'
									>
										<LogOutIcon className='h-4 w-4' />
										<span className='text-sm font-medium'>{t('navbar.userMenu.logoutFromAll')}</span>
									</DropdownMenuItem>
								</>
							) : (
								<>
									{/* في حالة عدم تسجيل الدخول */}
									<DropdownMenuLabel className='text-xs font-medium text-muted-foreground px-2.5 py-2'>
										{t('auth.welcome')}
									</DropdownMenuLabel>
									<DropdownMenuSeparator />

									<DropdownMenuItem
										onClick={() => router.push(APP_ROUTES.login)}
										className='flex items-center gap-2 py-2 cursor-pointer font-medium text-brand-primary focus:bg-brand-primary/5 rounded-md'
									>
										<span className='text-sm'>{t('auth.login.button')}</span>
									</DropdownMenuItem>

									<DropdownMenuItem
										onClick={() => router.push(APP_ROUTES.register)}
										className='flex items-center gap-2 py-2 cursor-pointer rounded-md'
									>
										<span className='text-sm'>{t('auth.register.title')}</span>
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
