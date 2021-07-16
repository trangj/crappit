import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';
import { useUser } from 'src/context/UserState';
import { Topic } from 'src/types/entities/topic';
import { Button, Card } from '../../ui';

type TopicCardProps = {
    topicData: Topic,
};

const TopicCard = ({ topicData }: TopicCardProps) => {
    const { user } = useUser();
    return (
        <Card className="p-3 flex flex-col gap-2">
            <div className="flex items-center">
                <h6 >About Community</h6>
                {user && topicData.user_moderator_id && (
                    <Link
                        href={`/t/${topicData.title}/moderation`}
                        passHref
                    >
                        <Button
                            as="a"
                            className="ml-auto"
                            variant="ghost"
                            border="rounded"
                        >
                            Settings
                        </Button>
                    </Link>
                )}
            </div>
            <p>{topicData.description}</p>
            <hr className="border-gray-500" />
            <p>
                Created {dayjs(topicData.created_at).format("LL")}
            </p>
            <Link passHref href={`/t/${topicData.title}/submit`}>
                <Button
                    as="a"
                    variant="filled"
                    fullWidth
                >
                    Add Post
                </Button>
            </Link>
        </Card>
    );
};

export default TopicCard;
