import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

// Explicitly catch all unmatched localized routes and trigger Next.js notFound()
export default function CatchAllPage(): ReactNode {
	notFound();
}
