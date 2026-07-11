import { LoginScreen } from '@/modules/auth';

interface PageProps {
	searchParams: Promise<{ error?: string }>;
}
export default async function LoginPage() {
	return <LoginScreen />;
}
