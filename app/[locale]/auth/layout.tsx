import AuthCard from '@/modules/auth/components/auth-card';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return <AuthCard>{children}</AuthCard>;
}
