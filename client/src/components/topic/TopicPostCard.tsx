import { Button, Divider, Flex, Heading, Spacer, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';
import { useUser } from 'src/context/UserState';
import useAddTopicFollow from 'src/hooks/topic-query/useAddTopicFollow';
import { Topic } from 'src/types/entities/topic';
import Card from '../utils/Card';

type TopicCardProps = {
    topicData: Topic,
};

const TopicCard = ({ topicData }: TopicCardProps) => {
    const { user } = useUser();
    const { isLoading, mutate } = useAddTopicFollow(topicData);

    return (
        <Card>
            <Flex>
                <Link href={`/t/${topicData.title}`} passHref>
                    <Heading size="md" alignSelf="center" as="a" wordBreak="break-all">r/{topicData.title}</Heading>
                </Link>
                <Spacer />
                {user && topicData.user_moderator_id && (
                    <Link
                        href={`/t/${topicData.title}/moderation`}
                        passHref
                    >
                        <Button
                            as="a"
                            size="sm"
                        >
                            Settings
                        </Button>
                    </Link>
                )}
            </Flex>
            <Text>{topicData.description}</Text>
            <Divider pt="2" />
            <Text pt="2">
                Created {dayjs(topicData.created_at).format("LL")}
            </Text>
            {user ? (
                <Button
                    isLoading={isLoading}
                    onClick={() => mutate(topicData.title)}
                    isFullWidth
                    mt="2"
                >
                    {topicData.user_followed_id ? "Unfollow" : "Follow"}
                </Button>
            ) : (
                <Link passHref href="/login">
                    <Button
                        as="a"
                        isFullWidth
                        mt='2'
                    >
                        Follow
                    </Button>
                </Link>
            )}
            <Link passHref href={`/t/${topicData.title}/submit`}>
                <Button
                    as="a"
                    mt="2"
                    isFullWidth
                >
                    Add Post
                </Button>
            </Link>
        </Card>
    );
};

export default TopicCard;
