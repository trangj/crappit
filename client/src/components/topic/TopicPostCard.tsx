import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';
import { useUser } from 'src/context/UserState';
import useAddTopicFollow from 'src/hooks/topic-query/useAddTopicFollow';
import { Topic } from 'src/types/entities/topic';
import { Card } from '../../ui';
import { Button } from '../../ui';

type TopicCardProps = {
    topicData: Topic,
};

const TopicCard = ({ topicData }: TopicCardProps) => {
    const { user } = useUser();
    const { isLoading, mutate } = useAddTopicFollow(topicData);

    return (
        <Card className="p-3 flex flex-col gap-2">
            <div className="flex items-center">
                <Link href={`/t/${topicData.title}`} passHref>
                    <a><h6>r/{topicData.title}</h6></a>
                </Link>
                <div className="w-full" />
                {user && topicData.user_moderator_id && (
                    <Link
                        href={`/t/${topicData.title}/moderation`}
                        passHref
                    >
                        <Button variant="ghost" border="rounded">
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
            {user ? (
                <Button
                    loading={isLoading}
                    onClick={() => mutate(topicData.title)}
                >
                    {topicData.user_followed_id ? "Unfollow" : "Follow"}
                </Button>
            ) : (
                <Link passHref href="/login">
                    <Button as="a">
                        Follow
                    </Button>
                </Link>
            )}
            <Link passHref href={`/t/${topicData.title}/submit`}>
                <Button as="a" variant="filled">
                    Add Post
                </Button>
            </Link>
        </Card>
    );
};

export default TopicCard;
