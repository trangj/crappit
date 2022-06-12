import Link from 'next/link';
import React from 'react';
import { Topic } from 'src/types/entities/topic';
import { Card } from 'src/ui/Card';

type TopicModeratorCardProps = {
  topicData: Topic;
};

function TopicModeratorCard({ topicData }: TopicModeratorCardProps) {
  return (
    <Card className="p-3 flex flex-col">
      <div className="text-gray-500 dark:text-gray-400 font-bold text-sm mb-3">
        Moderators
      </div>
      {topicData?.moderators.map((user, i) => (
        <Link passHref href={`/user/${user.user_id}`} key={i}>
          <a className="text-sm text-blue-600 dark:text-blue-400 mb-1">
            u/
            {user.username}
          </a>
        </Link>
      ))}
    </Card>
  );
}

export default TopicModeratorCard;
