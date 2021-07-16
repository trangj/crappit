import React, { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = ({ children, className = "", ...props }: CardProps) => {
	return (
		<div
			{...props}
			className={`mb-3 border rounded overflow-hidden bg-white dark:bg-gray-850 border-gray-300 dark:border-gray-700 ${className}`}
		>
			{children}
		</div>
	);
};
