import { Button, Divider, Flex, Heading, Spacer, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';
import { useUser } from 'src/context/UserState';
import { Topic } from 'src/types/entities/topic';
import Card from '../utils/Card';

type TopicCardProps = {
    topicData: Topic,
};

const TopicCard = ({ topicData }: TopicCardProps) => {
    const { user } = useUser();
    return (
        <Card>
            <Flex>
                <Heading size="md" alignSelf="center">About Community</Heading>
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
            <Text pt="4">{topicData.description}</Text>
            <Divider pt="2" />
            <Text pt="2">
                Created {dayjs(topicData.created_at).format("LL")}
            </Text>
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
