import React from "react";
import useTopic, { fetchTopic } from "../../../hooks/topic-query/useTopic";
import { useUser } from "../../../context/UserState";
import { Card, Divider } from "../../../ui";
import UpdateTopic from "../../../components/topic/UpdateTopic";
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

	if (topicLoading || !topicData) return <div>Loading...</div>;

	return (
		<div className="mt-16 container mx-auto max-w-5xl">

			{topicData.user_moderator_id === user.id ? (
				<Card className="p-3 flex flex-col gap-3" >
					<h5 >Change Settings</h5>
					<Divider />
					<UpdateTopic topic={topicData} />
					<Divider />
					<h5 >Moderators</h5>
					<AddModerator topic={topicData} />
				</Card>
			) : (
				<div>You are not a moderator of this topic</div>
			)}
		</div>
	);
};

export default Moderation;
