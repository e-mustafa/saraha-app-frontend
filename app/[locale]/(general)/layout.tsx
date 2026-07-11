import { Navbar } from '@/shared/components/layouts/navbar';

export default async function GeneralLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Navbar />
			{children}
		</>
	);
}
