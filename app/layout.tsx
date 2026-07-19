import { ReactNode } from 'react';

interface RootLayoutProps {
	children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
	return children;
}
