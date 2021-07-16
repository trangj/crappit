import React, { forwardRef, HTMLAttributes, ReactNode } from "react";

type LinkCardProps = HTMLAttributes<HTMLDivElement> & {
	children: ReactNode,
};

export const LinkCardOverlay = forwardRef<HTMLAnchorElement, HTMLAttributes<HTMLAnchorElement>>((props, ref) => {
	return (
		<a ref={ref} {...props} className="static link_card_overlay" />
	);
});

export const LinkCard = ({ children, className = "", ...props }: LinkCardProps) => {
	return (
		<div
			{...props}
			className={`link_card relative overflow-hidden my-2 border bg-white border-gray-300 dark:bg-gray-850 dark:border-gray-700 rounded hover:border-gray-500 dark:hover:border-gray-500 ${className}`}
		>
			{children}
		</div>
	);
};
