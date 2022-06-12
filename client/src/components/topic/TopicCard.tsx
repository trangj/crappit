import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';
import { useUser } from 'src/context/UserState';
import { Topic } from 'src/types/entities/topic';
import { ShieldCheckIcon } from '@heroicons/react/outline';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Divider } from '../../ui/Divider';

type TopicCardProps = {
  topicData: Topic;
};

function TopicCard({ topicData }: TopicCardProps) {
  const { user } = useUser();
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
      <Link passHref href={`/t/${topicData.title}/submit`}>
        <Button as="a" variant="filled" fullWidth>
          Add Post
        </Button>
      </Link>
    </Card>
  );
}

export default TopicCard;
