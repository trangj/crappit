import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { useUser } from 'src/context/UserState';
import useTopic from 'src/hooks/topic-query/useTopic';

function ModeratorLayout({ children } : { children : ReactNode}) {
  const router = useRouter();
  const { topic } = router.query;
  const { user } = useUser();
  const { isLoading: topicLoading, data: topicData } = useTopic(
    topic as string,
  );

  if (topicLoading || !topicData) return <div>Loading...</div>;

  if (topicData.user_moderator_id !== user?.id) {
    return (
      <>
        <Head>
          <title>{topicData.title}</title>
        </Head>
        <div className="fixed inset-y-1/2 w-full text-center">
          You must be a moderator of t/
          {topicData.title}
          {' '}
          to view this page
        </div>
      </>
    );
  }

  const getCurrentPath = () => {
    switch (router.route) {
      case '/t/[topic]/about':
        return 'Topic Settings';
      case '/t/[topic]/about/appearance':
        return 'Topic Appearance';
      case '/t/[topic]/about/moderators':
        return 'Moderators';
      case '/t/[topic]/about/rules':
        return 'Rules';
      default:
        return '';
    }
  };

  return (
    <>
      <div
        className="top-12 dark:bg-gray-850 bg-white h-10 flex items-center fixed w-full"
      >
        <span
          className="ml-6 font-bold uppercase text-xs"
        >
          <Link passHref href={`/t/${router.query.topic}`}>
            <a>
              t/
              {router.query.topic}
            </a>
          </Link>
          {' '}
          /
          {' '}
          {getCurrentPath()}
        </span>
      </div>
      <div className="flex">
        <div
          className="dark:bg-gray-800 bg-gray-100 flex flex-col w-64 overflow-x-hidden top-20 mt-2 bottom-0 fixed py-2"
        >
          <Link passHref href={`/t/${router.query.topic}/about`}>
            <a className={`menu-option cursor-pointer dark:hover:bg-white hover:bg-black hover:bg-opacity-5 dark:hover:bg-opacity-5 ${router.route === '/t/[topic]/about' ? 'button-ghost-active' : ''}`}>
              Topic Settings
            </a>
          </Link>
          <Link passHref href={`/t/${router.query.topic}/about/appearance`}>
            <a className={`menu-option cursor-pointer dark:hover:bg-white hover:bg-black hover:bg-opacity-5 dark:hover:bg-opacity-5 ${router.route === '/t/[topic]/about/appearance' ? 'button-ghost-active' : ''}`}>
              Topic Appearance
            </a>
          </Link>
          <Link passHref href={`/t/${router.query.topic}/about/moderators`}>
            <a className={`menu-option cursor-pointer dark:hover:bg-white hover:bg-black hover:bg-opacity-5 dark:hover:bg-opacity-5 ${router.route === '/t/[topic]/about/moderators' ? 'button-ghost-active' : ''}`}>
              Moderators
            </a>
          </Link>
          <Link passHref href={`/t/${router.query.topic}/about/rules`}>
            <a className={`menu-option cursor-pointer dark:hover:bg-white hover:bg-black hover:bg-opacity-5 dark:hover:bg-opacity-5 ${router.route === '/t/[topic]/about/rules' ? 'button-ghost-active' : ''}`}>
              Rules
            </a>
          </Link>
        </div>
        <div
          className="mt-28 container mx-auto max-w-6xl sm:px-5"
        >
          {children}
        </div>
      </div>
    </>
  );
}

export default ModeratorLayout;
