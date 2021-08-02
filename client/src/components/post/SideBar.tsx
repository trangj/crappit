import React, { ReactNode } from 'react';
import { Button } from 'src/ui/Button';

type Props = {
    children: ReactNode;
};

const SideBar = ({ children }: Props) => {
    return (
        <div className="flex-col w-80 hidden lg:flex">
            <div style={{ width: 'inherit' }}>
                {children}
            </div>
            <div className="sticky mt-12 flex justify-center" style={{ top: 'calc(100vh - 8px)', transform: 'translateY(-100%)' }}>
                <Button variant="filled" onClick={() => document.documentElement.scrollTop = 0} className="w-32">
                    Back to Top
                </Button>
            </div>
        </div>
    );
};

export default SideBar;
