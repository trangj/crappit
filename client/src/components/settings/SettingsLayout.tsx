import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';

function SettingsLayout({ children } : {children: ReactNode}) {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-gray-850 h-screen">
      <Head>
        <title>Crappit Settings</title>
      </Head>
      <div className="pt-16 container mx-auto max-w-6xl px-5">
        <h6 className="py-3">User Settings</h6>
        <div className="flex border-b border-gray-300 dark:border-gray-700">
          <Link passHref href="/settings">
            <a className={`text-sm font-bold p-3 ${router.asPath === '/settings' && 'border-b-2 dark:border-white border-black'}`}>Account</a>
          </Link>
          <Link passHref href="/settings/profile">
            <a className={`text-sm font-bold p-3 ${router.asPath === '/settings/profile' && 'border-b-2 dark:border-white border-black'}`}>Profile</a>
          </Link>
          <Link passHref href="/settings/notifications">
            <a className={`text-sm font-bold p-3 ${router.asPath === '/settings/notifications' && 'border-b-2 dark:border-white border-black'}`}>Notifications</a>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}

export default SettingsLayout;
