import React from "react";
import { Container, Divider, Heading, Image, Text } from "@chakra-ui/react";
import useTopic from "../../../hooks/topic-query/useTopic";
import { useUser } from "../../../context/UserState";
import Card from "../../../components/utils/Card";
import UpdateTopic from "../../../components/topic/UpdateTopic";
import AlertStatus from "../../../components/utils/AlertStatus";
import SkeletonCard from "../../../components/utils/SkeletonCard";
import AddModerator from "../../../components/topic/AddModerator";
import { useRouter } from "next/router";

const Moderation = () => {
	const router = useRouter();
	const { topic } = router.query;
	const { user } = useUser();
	const {
		isLoading: topicLoading,
		isError: topicIsError,
		data: topicData,
		error: topicError,
	} = useTopic(topic as string);

	if (topicLoading || !topicData) return <SkeletonCard />;
	if (topicIsError) return <AlertStatus status={topicError} />;

	return (
		<Container>
			{topicData.topic.user_moderator_id === user.id ? (
				<Card>
					<Heading>Topic Settings</Heading>
					<Divider my="3" />
					<Heading size="md">Current Banner</Heading>
					{topicData.topic.image_url ? (
						<Image
							alt={topicData.topic.image_name}
							src={topicData.topic.image_url}
							maxHeight="200px"
						/>
					) : (
						<Text>Image is not set...</Text>
					)}
					<Heading size="md">Current Description</Heading>
					<Text>{topicData.topic.description}</Text>
					<Heading size="md">Current Headline</Heading>
					{topicData.topic.headline ? (
						<Text>{topicData.topic.headline}</Text>
					) : (
						<Text>Headline is not set...</Text>
					)}
					<Divider my="3" />
					<Heading size="md">Change Settings</Heading>
					<UpdateTopic topic={topicData.topic} />
					<Divider my="3" />
					<Heading size="md">Moderators</Heading>
					<AddModerator topic={topicData.topic} />
				</Card>
			) : (
				<div>You are not a moderator of this topic</div>
			)}
		</Container>
	);
};

export default Moderation;
