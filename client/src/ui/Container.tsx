import React, { ReactNode } from 'react';

export const Container = ({ children }: { children: ReactNode; }) => {
    return (
        <div className="pt-16 mt-1 container mx-auto max-w-5xl sm:px-5">
            {children}
        </div>
    );
};