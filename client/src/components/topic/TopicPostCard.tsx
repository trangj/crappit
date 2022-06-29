import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';
import { useUser } from 'src/context/UserState';
import useAddTopicFollow from 'src/hooks/topic-query/useAddTopicFollow';
import { Topic } from 'src/types/entities/topic';
import Image from 'next/image';
import { ShieldCheckIcon } from '@heroicons/react/outline';
import { Avatar } from '../../ui/Avatar';
import { Card } from '../../ui/Card';
import { Divider } from '../../ui/Divider';
import { Button } from '../../ui/Button';

type TopicCardProps = {
  topicData: Topic;
};

function TopicCard({ topicData }: TopicCardProps) {
  const { user } = useUser();
  const { isLoading, mutate } = useAddTopicFollow(topicData);

  return (
    <Card className="p-3 flex flex-col gap-3">
      <div className="flex items-center">
        <div className="text-gray-500 dark:text-gray-400 font-bold text-sm">
          About Community
        </div>
        {user && topicData.user_moderator_id && (
        <Link href={`/t/${topicData.title}/about`} passHref>
          <Button
            as="a"
            className="ml-auto text-xs"
            variant="ghost"
            border="rounded"
            size="sm"
            icon={<ShieldCheckIcon height={21} width={21} className="mr-1" />}
          >
            MOD TOOLS
          </Button>
        </Link>
        )}
      </div>
      <div className="flex items-center mt-2">
        <div className="flex gap-3">
          <div className="h-14 w-14 rounded-full">
            {!topicData.icon_image_name ? (
              <Avatar />
            ) : (
              <Image
                alt="topic icon"
                src={topicData.icon_image_name}
                width={56}
                height={56}
                className="rounded-full bg-white"
              />
            )}
          </div>
          <Link href={`/t/${topicData.title}`} passHref>
            <a className="text-lg self-center font-medium">
              r/
              {topicData.title}
            </a>
          </Link>
        </div>
      </div>
      <div>
        <div className="content">{topicData.description}</div>
        <div className="font-medium mt-1">{topicData.number_of_followers}</div>
        <div className="font-medium text-xs">
          Follower
          {topicData.number_of_followers === 1 ? '' : 's'}
        </div>
      </div>
      <Divider />
      <div className="content">
        Created
        {' '}
        {dayjs(topicData.created_at).format('LL')}
      </div>
      {user ? (
        <Button loading={isLoading} onClick={() => mutate(topicData.title)}>
          {topicData.user_followed_id ? 'Unfollow' : 'Follow'}
        </Button>
      ) : (
        <Link passHref href="/login">
          <Button as="a">Follow</Button>
        </Link>
      )}
      <Link passHref href={`/t/${topicData.title}/submit`}>
        <Button variant="filled" as="a">
          Create Post
        </Button>
      </Link>
    </Card>
  );
}

export default TopicCard;
