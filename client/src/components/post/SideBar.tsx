/* eslint-disable no-return-assign */
import Link from 'next/link';
import React, { ReactNode } from 'react';
import { Button } from 'src/ui/Button';
import { Card } from 'src/ui/Card';

type Props = {
  children?: ReactNode;
};

function SideBar({ children }: Props) {
  return (
    <div className="flex-col w-80 hidden lg:flex">
      <div style={{ width: 'inherit' }}>
        {children}
      </div>
      <div className="h-full relative" style={{ width: 'inherit' }}>
        <Card className="p-3 sticky top-16 text-xs">
          <div className="flex">
            <div className="flex flex-col w-1/2 gap-1">
              <a>Help</a>
              <a>Crappit Coins</a>
              <a>Crappit Premium</a>
              <a>Crappit Gifts</a>
              <a>Communities</a>
              <Link href="/t">
                <a>Topics</a>
              </Link>
            </div>
            <div className="flex flex-col w-1/2 gap-1">
              <a>About</a>
              <a>Careers</a>
              <a>Press</a>
              <a>Advertise</a>
              <a>Blog</a>
              <a>Terms</a>
              <a>Content Policy</a>
              <a>Privacy Policy</a>
              <a>Mod Policy</a>
            </div>
          </div>
          <div className="mt-5">
            Crappit Inc © 2021. All rights reserved (not really)
          </div>
        </Card>
        <div className="sticky mt-12 flex justify-center" style={{ top: 'calc(100vh - 8px)', transform: 'translateY(-100%)' }}>
          <Button variant="filled" onClick={() => document.documentElement.scrollTop = 0} className="w-32">
            Back to Top
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
