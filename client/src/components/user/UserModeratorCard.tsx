import React from 'react';
import { User } from 'src/types/entities/user';
import { Avatar } from 'src/ui/Avatar';
import { Card } from 'src/ui/Card';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  profile: User;
};

function UserModeratorCard({ profile }: Props) {
  return (
    <Card className="p-3 flex flex-col">
      <div className="text-gray-500 dark:text-gray-400 font-bold text-sm mb-3">
        Moderator of these topics
      </div>
      <div className="flex flex-col gap-3">
        {profile.topics_moderated.map((topic, ind) => (
          <div key={ind} className="flex">
            <div className="h-8 w-8 flex rounded-full mr-2">
              {!topic.icon_image_name ? (
                <Avatar />
              ) : (
                <Image
                  alt="topic icon"
                  src={topic.icon_image_name}
                  width={32}
                  height={32}
                  className="rounded-full bg-white"
                />
              )}
            </div>
            <span className="flex flex-col font-medium text-xs">
              <Link href={`/t/${topic.title}`} passHref>
                <a className="hover:underline">
                  t/
                  {topic.title}
                </a>
              </Link>
              <span>
                {topic.number_of_followers}
                {' '}
                followers
              </span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default UserModeratorCard;
