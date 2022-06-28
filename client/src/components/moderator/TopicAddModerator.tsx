import Link from 'next/link';
import React from 'react';
import { Topic } from 'src/types/entities/topic';
import AddModerator from './AddModerator';
import DeleteModerator from './DeleteModerator';

type TopicAddModeratorProps = {
  topic: Topic;
};

function TopicAddModerator({ topic }: TopicAddModeratorProps) {
  return (
    <>
      <div>
        <span className="flex items-center">
          <h5>Moderators</h5>
          <AddModerator topic={topic} />
        </span>
      </div>
      <div className="flex flex-col mt-2">
        {topic.moderators.map((user, i) => (
          <div
            className="flex items-center justify-between py-2 border-t border-gray-300 dark:border-gray-700"
            key={i}
          >
            <Link passHref href={`/user/${user.user_id}`}>
              <a>
                u/
                {user.username}
              </a>
            </Link>
            <DeleteModerator topic={topic} user={user} />
          </div>
        ))}
      </div>
    </>
  );
}

export default TopicAddModerator;
