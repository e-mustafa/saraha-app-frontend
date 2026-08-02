import { cn } from '@/shared/utils/utils';
import * as React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

export interface TooltipRichContent {
	title?: React.ReactNode;
	description?: React.ReactNode;
	footer?: React.ReactNode;
}

export interface SmartTooltipProps {
	children: React.ReactElement;
	content?: React.ReactNode | TooltipRichContent;
	side?: 'top' | 'right' | 'bottom' | 'left';
	align?: 'start' | 'center' | 'end';
	delayDuration?: number;
	className?: string;
}

export function SmartTooltip({
	children,
	content,
	side = 'top',
	align = 'center',
	delayDuration,
	className,
}: SmartTooltipProps) {
	const childProps = children.props as Record<string, unknown>;

	// English comment: Safely extract accessibility and fallback text attributes from child component
	const childAriaLabel = childProps['aria-label'] as string | undefined;
	const childDataTooltip = childProps['data-tooltip'] as string | undefined;
	const childTitle = childProps['title'] as string | undefined;

	// English comment: Priority order: Explicit prop > aria-label > data-tooltip > title
	const activeContent = content ?? childAriaLabel ?? childDataTooltip ?? childTitle;

	if (!activeContent) {
		return children;
	}

	const isRichObject = (val: unknown): val is TooltipRichContent => {
		return (
			typeof val === 'object' &&
			val !== null &&
			!React.isValidElement(val) &&
			('title' in val || 'description' in val || 'footer' in val)
		);
	};

	// English comment: Remove native browser title attribute to prevent duplicate native tooltips
	const cleanedChildren =
		childProps.title && !childProps['data-tooltip']
			? React.cloneElement(children, { title: undefined } as React.HTMLAttributes<HTMLElement>)
			: children;
	return (
		<Tooltip delayDuration={delayDuration}>
			<TooltipTrigger asChild>{cleanedChildren}</TooltipTrigger>
			<TooltipContent
				side={side}
				align={align}
				className={cn(
					'bg-card-glass backdrop-blur-2xl border border-brand-secondary/30 text-popover-foreground ',
					className,
				)}
			>
				{isRichObject(activeContent) ? (
					<div className='space-y-1 text-xs max-w-xs'>
						{activeContent.title && <div className='font-semibold text-foreground'>{activeContent.title}</div>}
						{activeContent.description && (
							<div className='text-muted-foreground leading-relaxed'>{activeContent.description}</div>
						)}
						{activeContent.footer && (
							<div className='pt-1 border-t border-border/50 text-[10px] text-muted-foreground'>
								{activeContent.footer}
							</div>
						)}
					</div>
				) : typeof activeContent === 'string' ? (
					<p className='text-xs font-medium'>{activeContent}</p>
				) : (
					activeContent
				)}
			</TooltipContent>
		</Tooltip>
	);
}
