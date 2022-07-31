import React, { ReactNode } from 'react';

type ContainerProps = { children: ReactNode, className?: string, topPadding?: string }

export function Container({ children, className = '', topPadding = 'mt-16' }: ContainerProps) {
  return (
    <div className={`mt-1 container mx-auto max-w-5xl sm:px-5 ${className} ${topPadding}`}>
      {children}
    </div>
  );
}
