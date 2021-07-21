import Link from 'next/link';
import React from 'react';
import { Topic } from 'src/types/entities/topic';
import { Card } from 'src/ui';

type TopicModeratorCardProps = {
    topicData: Topic;
};

const TopicModeratorCard = ({ topicData }: TopicModeratorCardProps) => {
    return (
        <Card className="p-3 flex flex-col">
            <p className="text-gray-500 dark:text-gray-400 font-semibold text-sm mb-3">Moderators</p>
            {
                topicData?.moderators.map((user) => (
                    <Link passHref href={`/user/${user.user_id}`}>
                        <a className="text-sm text-blue-600 dark:text-blue-400 mb-1">u/{user.username}</a>
                    </Link>
                ))
            }
        </Card>
    );
};

export default TopicModeratorCard;
