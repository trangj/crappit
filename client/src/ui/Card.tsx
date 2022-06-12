import React, { HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`card ${className}`}
    >
      {children}
    </div>
  );
}
