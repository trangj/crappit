import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';
import { useUser } from 'src/context/UserState';
import useAddTopicFollow from 'src/hooks/topic-query/useAddTopicFollow';
import { Topic } from 'src/types/entities/topic';
import { Card, Divider } from '../../ui';
import { Button } from '../../ui';
import Image from 'next/image';

type TopicCardProps = {
    topicData: Topic,
};

const TopicCard = ({ topicData }: TopicCardProps) => {
    const { user } = useUser();
    const { isLoading, mutate } = useAddTopicFollow(topicData);

    return (
        <Card>
            {topicData.image_url ? (
                <div style={{ position: 'relative', height: 36 }}>
                    <Image
                        alt="Topic banner"
                        src={topicData.image_name}
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            ) : (
                <div className="w-full h-9 bg-blue-300" />
            )}
            <div className="p-3 flex flex-col gap-3">
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
                            <Button variant="ghost" border="rounded" className="text-xs">
                                Settings
                            </Button>
                        </Link>
                    )}
                </div>
                <p>{topicData.description}</p>
                <Divider />
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
            </div>
        </Card>
    );
};

export default TopicCard;
