import { ThemeSwitcher } from '@/shared/components/theme-switcher';
import { Card } from '@/shared/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthCard({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex flex-col gap-4 items-center justify-center px-4 min-h-screen absolute inset-0 bg-linear-to-br from-brand-primary/10 via-brand-secondary/5 to-transparent animate-gradient-xy'>
			{/* <div className='w-full max-w-md'></div> */}
			<ThemeSwitcher />
			{/* <Card className='w-full max-w-md bg-card-glass bg-linear-to-br from-violet-500/5 to-purple-600/10 shadow-lg shadow-brand-secondary/30'> */}
			<Card className='w-full max-w-md bg-card-glass bg-linear-to-br from-brand-primary/10 to-brand-secondary/10 shadow-lg shadow-brand-secondary/30'>
				<div className='flex justify-center'>
					<Link href='/'>
						<Image src='/saraha-app-logo.png' alt='Logo' width={100} height={100} />
					</Link>
				</div>
				{children}
			</Card>
		</div>
	);
}
