import React, { HTMLAttributes } from 'react';

export const Divider = ({ className = "" }: HTMLAttributes<HTMLHRElement>) => {
    return (
        <hr className={`divider ${className}`} />
    );
};