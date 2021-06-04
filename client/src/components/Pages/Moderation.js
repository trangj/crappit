import React, { useContext } from "react";
import { Divider, Heading } from "@chakra-ui/react";
import useTopic from "../../hooks/topic-query/useTopic";
import { UserContext } from "../../context/UserState";
import Card from "../Utils/Card";
import UpdateTopic from "../Topic/UpdateTopic";
import AlertStatus from "../Utils/AlertStatus";
import SkeletonCard from "../Utils/SkeletonCard";
import AddModerator from "../Topic/AddModerator";

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

	return topicData.topic.user_moderator_id === user.id ? (
		<Card>
			<Heading>Topic Settings</Heading>
			<Divider my="3" />
			<Heading size="md">Description and Banner</Heading>
			<UpdateTopic topic={topicData.topic} />
			<Divider my="3" />
			<Heading size="md">Moderators</Heading>
			<AddModerator topic={topicData.topic} />
		</Card>
	) : (
		<div>You are not a moderator of this topic</div>
	);
};

export default Moderation;
