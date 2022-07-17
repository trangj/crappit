import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { Card } from 'src/ui/Card';
import { Avatar } from 'src/ui/Avatar';
import { Button } from 'src/ui/Button';
import { useUser } from 'src/context/UserState';
import { LinkIcon, PhotographIcon } from '@heroicons/react/outline';

type Props = {
    url?: string;
};

function CreatePost({ url = '' }: Props) {
  const { user } = useUser();

  return (
    <Card className="flex p-2 gap-2 items-center">
      <Link passHref href={user ? `/user/${user.id}` : '/login'}>
        <a className="flex-none overflow-hidden rounded-full border-2 dark:border-gray-700 h-10 w-10">
          {!user || !user.avatar_image_name ? <Avatar /> : <Image alt="user avatar" src={user.avatar_image_name} width={38} height={38} className="bg-white" />}
        </a>
      </Link>
      <Link passHref href={`${url}/submit`}>
        <a className="w-full">
          <input placeholder="Create Post" className="w-full h-9 px-4 bg-gray-100 hover:bg-white hover:border-blue-500 dark:bg-gray-800 border dark:border-gray-700 dark:hover:border-white dark:hover:bg-gray-900 rounded" />
        </a>
      </Link>
      <Link passHref href={`${url}/submit?type=photo`}>
        <Button as="a" variant="ghost" border="rounded">
          <PhotographIcon className="h-6 w-6" />
        </Button>
      </Link>
      <Link passHref href={`${url}/submit?type=link`}>
        <Button as="a" variant="ghost" border="rounded">
          <LinkIcon className="h-6 w-6" />
        </Button>
      </Link>
    </Card>
  );
}

export default CreatePost;
