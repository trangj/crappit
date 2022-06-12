import React, { HTMLAttributes } from 'react';

export function Avatar({ className = '' }: HTMLAttributes<SVGAElement>) {
  return (
    <svg className={`avatar ${className}`} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" />
    </svg>
  );
}
