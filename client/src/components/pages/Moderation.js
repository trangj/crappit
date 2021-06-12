import React, { useContext } from "react";
import { Container, Divider, Heading, Image, Text } from "@chakra-ui/react";
import useTopic from "../../hooks/topic-query/useTopic";
import { UserContext } from "../../context/UserState";
import Card from "../utils/Card";
import UpdateTopic from "../topic/UpdateTopic";
import AlertStatus from "../utils/AlertStatus";
import SkeletonCard from "../utils/SkeletonCard";
import AddModerator from "../topic/AddModerator";

const Moderation = ({ match }) => {
	const { user } = useContext(UserContext);
	const {
		isLoading: topicLoading,
		isError: topicIsError,
		data: topicData,
		error: topicError,
	} = useTopic(match.params.topic);

	if (topicLoading) return <SkeletonCard />;
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
