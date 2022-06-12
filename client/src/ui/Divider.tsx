import React, { HTMLAttributes } from 'react';

export function Divider({ className = '' }: HTMLAttributes<HTMLHRElement>) {
  return (
    <hr className={`divider ${className}`} />
  );
}
