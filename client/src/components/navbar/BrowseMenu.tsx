import React, { forwardRef, ReactNode, useMemo } from 'react';
import { Menu } from '@headlessui/react';
import Link from 'next/link';
import {
  ChevronDownIcon, PlusIcon, BellIcon, StarIcon as StarIconOutline,
} from '@heroicons/react/outline';
import { Avatar } from 'src/ui/Avatar';
import { HomeIcon, StarIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import useAddTopicFavorite from 'src/hooks/topic-query/useAddTopicFavorite';
import { TopicsFollowed } from 'src/types/entities/user';
import useTopicFollow from '../../hooks/topic-query/useTopicFollow';

type NextLinkProps = {
  href: string;
  children: ReactNode;
  active: boolean;
  icon?: ReactNode;
};

const NextLink = forwardRef<any, any>(({
  href, children, icon, active, ...props
}: NextLinkProps, ref) => (
  <Link href={href} passHref>
    <a {...props} className={`menu-option ${active && 'bg-gray-100 dark:bg-gray-800'}`} ref={ref}>
      {icon || null}
      {children}
    </a>
  </Link>
));

function MenuTitle({ children } : {children: ReactNode}) {
  return (
    <div
      className="px-6 py-2 text-gray-500 dark:text-gray-400"
      style={{ fontSize: 10 }}
    >
      {children}
    </div>
  );
}

function TopicNextLink({ topic, mutate } : {topic: TopicsFollowed, mutate: any}) {
  return (
    <span
      className="relative"
    >
      <Menu.Item>
        {({ active }) => (
          <NextLink
            active={active}
            href={`/t/${topic.title}`}
            icon={topic.icon_image_name ? (
              <Image
                alt="topic icon"
                src={topic.icon_image_name}
                width={20}
                height={20}
                className="rounded-full bg-white"
              />
            ) : (
              <Avatar className="h-5 w-5 flex-none" />
            )}
          >
            t/
            {topic.title}
          </NextLink>
        )}
      </Menu.Item>
      <span
        className="absolute right-0 top-2.5 mr-4 h-5 w-5"
        onClick={() => mutate(topic.title)}
      >
        {topic.favorite
          ? <StarIcon className="h-5 w-5 text-blue-500" />
          : <StarIconOutline />}
      </span>
    </span>
  );
}

function BrowseMenu() {
  const { data, isLoading } = useTopicFollow();
  const { mutate } = useAddTopicFavorite();

  const favoriteTopics = useMemo(() => {
    if (data) {
      return data.topics_followed.filter((topic) => topic.favorite);
    }
    return [];
  }, [data, data?.topics_followed]);

  return (
    <Menu as="div" className="relative hidden sm:inline-block text-left">
      {({ open }) => (
        <>
          <Menu.Button
            className={`menu-button text-sm border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded border lg:w-64 ${
              open ? 'border-gray-200 dark:border-gray-700 rounded-b-none' : ''
            }`}
          >
            <span className="mr-2">Browse</span>
            <ChevronDownIcon className="h-4 w-4 ml-auto" />
          </Menu.Button>
          <Menu.Items className="menu w-64" style={{ maxHeight: 482 }}>
            {favoriteTopics.length > 0 && (
            <>
              <MenuTitle>
                FAVORITES
              </MenuTitle>
              {
                  favoriteTopics.map((topic, i) => (
                    <TopicNextLink topic={topic} key={i} mutate={mutate} />
                  ))
                }
            </>
            )}
            <MenuTitle>
              MY TOPICS
            </MenuTitle>
            <Menu.Item>
              {({ active }) => (
                <NextLink
                  active={active}
                  href="/t/create"
                  icon={<PlusIcon className="h-5 w-5" />}
                >
                  Create Topic
                </NextLink>
              )}
            </Menu.Item>
            {!isLoading
              && data
              && data.topics_followed.map((topic, i) => (
                <TopicNextLink topic={topic} key={i} mutate={mutate} />
              ))}
            <MenuTitle>
              OTHER
            </MenuTitle>
            <Menu.Item>
              {({ active }) => (
                <NextLink
                  active={active}
                  href="/"
                  icon={<HomeIcon className="h-5 w-5" />}
                >
                  Home
                </NextLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NextLink
                  active={active}
                  href="/submit"
                  icon={<PlusIcon className="h-5 w-5" />}
                >
                  Create Post
                </NextLink>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <NextLink
                  href="/notifications"
                  icon={<BellIcon className="h-5 w-5" />}
                  active={active}
                >
                  Notifications
                </NextLink>
              )}
            </Menu.Item>
          </Menu.Items>
        </>
      )}
    </Menu>
  );
}

export default BrowseMenu;
