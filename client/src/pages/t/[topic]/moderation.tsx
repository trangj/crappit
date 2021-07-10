import React from "react";
import { Container, Divider, Heading } from "@chakra-ui/react";
import useTopic, { fetchTopic } from "../../../hooks/topic-query/useTopic";
import { useUser } from "../../../context/UserState";
import Card from "../../../components/utils/Card";
import UpdateTopic from "../../../components/topic/UpdateTopic";
import SkeletonCard from "../../../components/utils/SkeletonCard";
import AddModerator from "../../../components/topic/AddModerator";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(['topic', query.topic], () => fetchTopic(query.topic as string));
	return {
		props: {
			dehydratedState: dehydrate(queryClient)
		}
	};
};

const Moderation = () => {
	const router = useRouter();
	const { topic } = router.query;
	const { user } = useUser();
	const {
		isLoading: topicLoading,
		data: topicData,
	} = useTopic(topic as string);

	if (topicLoading || !topicData) return <SkeletonCard />;

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
