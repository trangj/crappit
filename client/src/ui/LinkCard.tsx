/* eslint-disable jsx-a11y/anchor-has-content */
import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';

type LinkCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode,
};

export const LinkCardOverlay = forwardRef<HTMLAnchorElement, HTMLAttributes<HTMLAnchorElement>>(
  (props, ref) => (
    <a ref={ref} {...props} className="static link_card_overlay" />
  ),
);

export function LinkCard({ children, className = '', ...props }: LinkCardProps) {
  return (
    <div
      {...props}
      className={`link_card ${className}`}
    >
      {children}
    </div>
  );
}
