import React from 'react';
import Link from 'next/link';
import { Topic } from 'src/types/entities/topic';
import Image from 'next/image';
import { Button } from 'src/ui/Button';
import { Avatar } from 'src/ui/Avatar';
import useAddTopicFollow from '../../hooks/topic-query/useAddTopicFollow';
import { useUser } from '../../context/UserState';
import TopicBanner from './TopicBanner';

type Props = {
  topic: Topic;
};

function TopicHeader({ topic }: Props) {
  const { user } = useUser();
  const { isLoading, mutate } = useAddTopicFollow(topic);

  return (
    <div className="mt-12 min-h-56 bg-white dark:bg-gray-850">
      <TopicBanner topic={topic} />
      <div className="container mx-auto max-w-5xl px-5">
        <div className="flex pb-3 -mt-3.5">
          <div
            className="h-20 w-20 flex rounded-full border-4 border-white"
            style={{ zIndex: 1 }}
          >
            {!topic.icon_image_name ? (
              <Avatar />
            ) : (
              <Image
                alt="topic icon"
                src={topic.icon_image_name}
                width={80}
                height={80}
                className="rounded-full bg-white"
              />
            )}
          </div>
          <div
            className="flex mt-6 pl-4 w-full"
            style={{ width: 'calc(100% - 80px)' }}
          >
            <div
              className="inline-block gap-3 min-h-10 pr-4 "
              style={{ maxWidth: 'calc(100% - 96px)' }}
            >
              <h4
                className="overflow-ellipsis overflow-hidden"
                style={{ fontSize: 28 }}
              >
                {topic.headline ? topic.headline : topic.title}
              </h4>
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                t/
                {topic.title}
              </div>
            </div>
            {user ? (
              <Button
                loading={isLoading}
                onClick={() => mutate(topic.title)}
                variant={topic.user_followed_id ? 'outline' : 'filled'}
                className="w-24 self-start"
              >
                {topic.user_followed_id ? 'Unfollow' : 'Follow'}
              </Button>
            ) : (
              <Link passHref href="/login">
                <Button as="a" className="w-24 self-start">
                  Follow
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopicHeader;
