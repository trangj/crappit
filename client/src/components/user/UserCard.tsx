import React from 'react';
import { User } from 'src/types/entities/user';
import Image from 'next/image';
import dayjs from 'dayjs';
import { Card } from 'src/ui/Card';

type Props = {
  profile: User;
};

function UserCard({ profile }: Props) {
  return (
    <Card>
      <div className="h-24 bg-blue-400" />
      <div className="-mt-16 ml-3 h-20 w-20 border-white dark:border-gray-850 border-4 rounded bg-gray-300 dark:bg-gray-500">
        {profile && profile.avatar_image_name && (
        <Image
          src={profile.avatar_image_name}
          alt="user avatar"
          height={80}
          width={80}
          className="bg-white"
        />
        )}
      </div>
      <div className="px-3 pb-3 flex flex-col">
        <small className="font-medium">
          u/
          {profile?.username}
        </small>
        <div className="flex mt-2">
          <div className="flex flex-col w-1/2">
            <small className="font-medium text-sm">Karma</small>
            <small className="text-gray-500 dark:text-gray-400">
              {profile?.karma}
            </small>
          </div>
          <div className="flex flex-col w-1/2">
            <small className="font-medium text-sm">Cake day</small>
            <small className="text-gray-500 dark:text-gray-400">
              {dayjs(profile?.created_at).format('MMMM D, YYYY')}
            </small>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default UserCard;
