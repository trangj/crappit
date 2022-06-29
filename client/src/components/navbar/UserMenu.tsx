import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import { User } from 'src/types/entities/user';
import { Menu } from '@headlessui/react';
import { Avatar } from 'src/ui/Avatar';
import {
  ChevronDownIcon, SearchIcon, UserCircleIcon, CogIcon, LogoutIcon, MoonIcon, SunIcon,
} from '@heroicons/react/outline';
import Image from 'next/image';

type Props = {
  user: User | null,
  logoutUser: () => Promise<void>;
  theme: string;
  setTheme: (arg: string) => void;
};

type NextLinkProps = {
  href: string,
  children: ReactNode,
  icon?: ReactNode;
};

type OptionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode,
  icon?: ReactNode,
};

function NextLink({
  href, children, icon, ...props
}: NextLinkProps) {
  return (
    <Link href={href} passHref>
      <a {...props} className="menu-option text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
        {icon || null}
        {children}
      </a>
    </Link>
  );
}

function Option({ children, icon, ...props }: OptionProps) {
  return (
    <button {...props} className="menu-option text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white" type="button">
      {icon || null}
      {children}
    </button>
  );
}

function UserMenu({
  user, logoutUser, theme, setTheme,
}: Props) {
  return (
    <Menu as="div" className="relative hidden sm:inline-block text-left">
      <Menu.Button className={`menu-button ${user ? 'xl:w-56' : 'ml-4'}`}>
        {user && (
        <>
          <span className="h-6 w-6 mr-2">
            {!user || !user.avatar_image_name ? <Avatar /> : <Image alt="user avatar" src={user.avatar_image_name} width={24} height={24} className="rounded-full bg-white" />}
          </span>
          <div className="hidden xl:flex flex-col">
            <span>
              {user.username}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {user.karma}
              {' '}
              karma
            </span>
          </div>
        </>
        )}
        <ChevronDownIcon className="h-4 w-4 ml-auto" />
      </Menu.Button>
      <Menu.Items className="menu w-56">
        {user && (
        <>
          <Menu.Item as={NextLink} href={`/user/${user.id}`} icon={<UserCircleIcon className="h-5 w-5" />}>
            Profile
          </Menu.Item>
          <Menu.Item as={NextLink} href="/settings" icon={<CogIcon className="h-5 w-5" />}>
            Settings
          </Menu.Item>
        </>
        )}
        <Menu.Item as={NextLink} href="/t" icon={<SearchIcon className="h-5 w-5" />}>
          Discover Topics
        </Menu.Item>
        <Menu.Item
          as={Option}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          icon={theme === 'dark' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
        >
          Dark Mode
        </Menu.Item>
        {user ? (
          <Menu.Item
            onClick={async () => logoutUser()}
            as={Option}
            icon={<LogoutIcon className="h-5 w-5" />}
          >
            Logout
          </Menu.Item>
        ) : (
          <Menu.Item as={NextLink} href="/login" icon={<UserCircleIcon className="h-5 w-5" />}>
            Sign Up or Log In
          </Menu.Item>
        )}
      </Menu.Items>
    </Menu>
  );
}

export default UserMenu;
