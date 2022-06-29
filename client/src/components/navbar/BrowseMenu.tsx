import React, { ReactNode } from 'react';
import { Menu } from '@headlessui/react';
import Link from 'next/link';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/outline';
import { Avatar } from 'src/ui/Avatar';
import { Divider } from 'src/ui/Divider';
import { HomeIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import useTopicFollow from '../../hooks/topic-query/useTopicFollow';

type NextLinkProps = {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
};

function NextLink({
  href, children, icon, ...props
}: NextLinkProps) {
  return (
    <Link href={href} passHref>
      <a {...props} className="menu-option">
        {icon || null}
        {children}
      </a>
    </Link>
  );
}

function BrowseMenu() {
  const { data, isLoading } = useTopicFollow();
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
          <Menu.Items className="menu w-64">
            <div
              className="px-6 py-2 text-gray-500 dark:text-gray-400"
              style={{ fontSize: 10 }}
            >
              MY TOPICS
            </div>
            <Menu.Item
              as={NextLink}
              href="/t/create"
              icon={<PlusIcon className="h-5 w-5" />}
            >
              Create Topic
            </Menu.Item>
            {!isLoading
              && data
              && data.topics_followed.map((topic, i) => (
                <Menu.Item
                  as={NextLink}
                  key={i}
                  href={`/t/${topic.title}`}
                  icon={
                    topic.icon_image_name ? (
                      <Image
                        alt="topic icon"
                        src={topic.icon_image_name}
                        width={20}
                        height={20}
                        className="rounded-full bg-white"
                      />
                    ) : (
                      <Avatar className="h-5 w-5 flex-none" />
                    )
                  }
                >
                  t/
                  {topic.title}
                </Menu.Item>
              ))}
            <Divider className="my-2" />
            <div
              className="px-6 py-2 text-gray-500 dark:text-gray-400"
              style={{ fontSize: 10 }}
            >
              OTHER
            </div>
            <Menu.Item
              as={NextLink}
              href="/"
              icon={<HomeIcon className="h-5 w-5" />}
            >
              Home
            </Menu.Item>
            <Menu.Item
              as={NextLink}
              href="/submit"
              icon={<PlusIcon className="h-5 w-5" />}
            >
              Create Post
            </Menu.Item>
          </Menu.Items>
        </>
      )}
    </Menu>
  );
}

export default BrowseMenu;
