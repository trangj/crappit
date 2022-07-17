import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

function ModeratorLayout({ children } : any) {
  const router = useRouter();

  return (
    <>
      <div
        className="mt-12 dark:bg-gray-900 h-10 flex items-center"
      >
        <Link passHref href={`/t/${router.query.topic}`}>
          <a className="ml-4 font-semibold uppercase text-sm">
            t/
            {router.query.topic}
          </a>
        </Link>
      </div>
      <div className="flex">
        <div
          className="bg-white dark:bg-gray-850 flex flex-col w-64 overflow-x-hidden top-20 mt-2 bottom-0 fixed py-2"
        >
          <Link passHref href={`/t/${router.query.topic}/about`}>
            <a className={`menu-option cursor-pointer ${router.route === '/t/[topic]/about' ? 'button-ghost-active' : ''}`}>
              Topic Settings
            </a>
          </Link>
          <Link passHref href={`/t/${router.query.topic}/about/appearance`}>
            <a className={`menu-option cursor-pointer ${router.route === '/t/[topic]/about/appearance' ? 'button-ghost-active' : ''}`}>
              Topic Appearance
            </a>
          </Link>
          <Link passHref href={`/t/${router.query.topic}/about/moderators`}>
            <a className={`menu-option cursor-pointer ${router.route === '/t/[topic]/about/moderators' ? 'button-ghost-active' : ''}`}>
              Moderators
            </a>
          </Link>
          <Link passHref href={`/t/${router.query.topic}/about/rules`}>
            <a className={`menu-option cursor-pointer ${router.route === '/t/[topic]/about/rules' ? 'button-ghost-active' : ''}`}>
              Rules
            </a>
          </Link>
        </div>
        <div
          className="mt-5 container mx-auto max-w-6xl sm:px-5"
        >
          {children}
        </div>
      </div>
    </>
  );
}

export default ModeratorLayout;
