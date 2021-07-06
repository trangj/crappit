import React from "react";
import { Container, Divider, Heading } from "@chakra-ui/react";
import useTopic, { fetchTopic } from "../../../hooks/topic-query/useTopic";
import { useUser } from "../../../context/UserState";
import Card from "../../../components/utils/Card";
import UpdateTopic from "../../../components/topic/UpdateTopic";
import AlertStatus from "../../../components/utils/AlertStatus";
import SkeletonCard from "../../../components/utils/SkeletonCard";
import AddModerator from "../../../components/topic/AddModerator";
import { useRouter } from "next/router";
import { Topic } from "src/types/entities/topic";
import { GetServerSideProps } from "next";

type ModerationProps = {
	initialTopic: Topic;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const initialTopic = await fetchTopic(query.topic as string);
	return {
		props: {
			initialTopic
		}
	};
};

const Moderation = ({ initialTopic }: ModerationProps) => {
	const router = useRouter();
	const { topic } = router.query;
	const { user } = useUser();
	const {
		isLoading: topicLoading,
		isError: topicIsError,
		data: topicData,
		error: topicError,
	} = useTopic(topic as string, initialTopic);

	if (topicLoading || !topicData) return <SkeletonCard />;
	if (topicIsError) return <AlertStatus status={topicError} />;

	return (
		<Container>
			{topicData.user_moderator_id === user.id ? (
				<Card>
					<Heading size="md">Change Settings</Heading>
					<UpdateTopic topic={topicData} />
					<Divider my="3" />
					<Heading size="md">Moderators</Heading>
					<AddModerator topic={topicData} />
				</Card>
			) : (
				<div>You are not a moderator of this topic</div>
			)}
		</Container>
	);
};

export default Moderation;
