import React, { HTMLAttributes } from 'react';

export const Divider = ({ className = "" }: HTMLAttributes<HTMLHRElement>) => {
    return (
        <hr className={`border-gray-300 dark:border-gray-700 ${className}`} />
    );
};