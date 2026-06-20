import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Saraha - Anonymous Messaging',
	description: 'Send and receive anonymous messages securely',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}
