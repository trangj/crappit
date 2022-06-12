import React, { forwardRef, HTMLAttributes } from 'react';
import { User } from 'src/types/entities/user';
import Link from 'next/link';
import { Divider } from 'src/ui/Divider';
import useTopicFollow from '../../hooks/topic-query/useTopicFollow';

type Props = {
    user: User | null;
    logoutUser: () => void;
    showMenu: (arg: boolean) => void;
    theme: string;
    setTheme: (arg: string) => void;
};

const MenuItem = forwardRef<HTMLAnchorElement, HTMLAttributes<HTMLAnchorElement>>(
  ({ children, ...props }, ref) => (
    <a className="block py-2 px-4 hover:bg-opacity-5 hover:bg-white" ref={ref} {...props}>
      {children}
    </a>
  ),
);
MenuItem.displayName = 'MenuItem';

function MobileMenu({
  user, logoutUser, showMenu, theme, setTheme,
}: Props) {
  const { data, isLoading } = useTopicFollow();

  return (
    <div className="flex sm:hidden flex-col mt-3">
      <Link href="/" passHref>
        <MenuItem onClick={() => showMenu(false)}>
          Home
        </MenuItem>
      </Link>
      <Link href="/t" passHref>
        <MenuItem onClick={() => showMenu(false)}>
          Discover Topics
        </MenuItem>
      </Link>
      <Link href="/submit" passHref>
        <MenuItem onClick={() => showMenu(false)}>
          Create a post
        </MenuItem>
      </Link>
      <Link href="/t/create" passHref>
        <MenuItem onClick={() => showMenu(false)}>
          Create a topic
        </MenuItem>
      </Link>
      <Divider className="mx-4 my-2" />
      {!user ? (
        <Link href="/register" passHref>
          <MenuItem onClick={() => showMenu(false)}>
            Sign up to follow topics!
          </MenuItem>
        </Link>
      ) : (
        !isLoading && data && (data.topics_followed.map((topic, i) => (
          <Link href={`/t/${topic.title}`} passHref key={i}>
            <MenuItem onClick={() => showMenu(false)}>
              t/
              {topic.title}
            </MenuItem>
          </Link>
        )))
      )}
      <Divider className="mx-4 my-2" />
      <MenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Dark Mode
      </MenuItem>
      {!user ? (
        <>
          <Link href="/login" passHref>
            <MenuItem onClick={() => showMenu(false)}>
              Login
            </MenuItem>
          </Link>
          <Link href="/register" passHref>
            <MenuItem onClick={() => showMenu(false)}>
              Register
            </MenuItem>
          </Link>
        </>
      ) : (
        <>
          <Link href={`/user/${user.id}`} passHref>
            <MenuItem onClick={() => showMenu(false)}>
              {user.username}
            </MenuItem>
          </Link>
          <Link href="/settings" passHref>
            <MenuItem onClick={() => showMenu(false)}>
              Settings
            </MenuItem>
          </Link>
          <MenuItem onClick={async () => logoutUser()}>
            Logout
          </MenuItem>
        </>
      )}
    </div>
  );
}

export default MobileMenu;
