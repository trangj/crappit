import React, { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
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
  active: boolean;
  icon?: ReactNode;
};

type OptionProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode,
  active: boolean
  icon?: ReactNode,
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

const Option = forwardRef<any, any>(({
  children, icon, active, ...props
}: OptionProps, ref) => (
  <button {...props} ref={ref} className={`menu-option ${active && 'bg-gray-100 dark:bg-gray-800'}`} type="button">
    {icon || null}
    {children}
  </button>
));

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
          <Menu.Item>
            {({ active }) => (
              <NextLink
                active={active}
                href={`/user/${user.id}`}
                icon={<UserCircleIcon className="h-5 w-5" />}
              >
                Profile
              </NextLink>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <NextLink
                active={active}
                href="/settings"
                icon={<CogIcon className="h-5 w-5" />}
              >
                Settings
              </NextLink>
            )}
          </Menu.Item>
        </>
        )}
        <Menu.Item>
          {({ active }) => (
            <NextLink
              active={active}
              href="/t"
              icon={<SearchIcon className="h-5 w-5" />}
            >
              Discover Topics
            </NextLink>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <Option
              active={active}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              icon={theme === 'dark' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            >
              Dark Mode
            </Option>
          )}
        </Menu.Item>
        {user ? (
          <Menu.Item>
            {({ active }) => (
              <Option
                active={active}
                onClick={async () => logoutUser()}
                icon={<LogoutIcon className="h-5 w-5" />}
              >
                Logout
              </Option>
            )}
          </Menu.Item>
        ) : (
          <Menu.Item>
            {({ active }) => (
              <NextLink
                active={active}
                href="/login"
                icon={<UserCircleIcon className="h-5 w-5" />}
              >
                Sign Up or Log In
              </NextLink>
            )}
          </Menu.Item>
        )}
      </Menu.Items>
    </Menu>
  );
}

export default UserMenu;
