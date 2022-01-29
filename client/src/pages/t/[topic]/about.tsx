import React, { Fragment, ReactNode } from "react";
import useTopic, { fetchTopic } from "../../../hooks/topic-query/useTopic";
import { useUser } from "../../../context/UserState";
import { Card } from "../../../ui/Card";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import Head from "next/head";
import { Tab } from "@headlessui/react";
import TopicSettings from "src/components/moderator/TopicSettings";
import TopicAppearance from "src/components/moderator/TopicAppearance";
import TopicAddModerator from "src/components/moderator/TopicAddModerator";
import TopicRules from "src/components/moderator/TopicRules";

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
}) => {
	if (!req.cookies["crappit_session"]) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(["topic", query.topic], () =>
		fetchTopic(query.topic as string)
	);
	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	};
};

const TabItem = ({ children }: { children: ReactNode }) => (
	<Tab as={Fragment}>
		{({ selected }) => (
			<div
				className={`menu-option cursor-pointer ${
					selected ? "button-ghost-active" : ""
				}`}
			>
				{children}
			</div>
		)}
	</Tab>
);

const Moderation = () => {
	const router = useRouter();
	const { topic, page } = router.query;
	const { user } = useUser();
	const { isLoading: topicLoading, data: topicData } = useTopic(
		topic as string
	);

	if (topicLoading || !topicData) return <div>Loading...</div>;

	if (topicData.user_moderator_id !== user?.id) {
		return (
			<>
				<Head>
					<title>{topicData.title}</title>
				</Head>
				<div className="fixed inset-y-1/2 w-full text-center">
					You must be a moderator of t/{topicData.title} to view this page
				</div>
			</>
		);
	}

	return (
		<div className="flex mt-12">
			<Head>
				<title>{topicData.title}</title>
			</Head>
			<Tab.Group
				vertical
				defaultIndex={page ? parseInt(page as string) : 0}
				onChange={(i) =>
					router.push(`/t/${topicData.title}/about?page=${i}`, undefined, {
						shallow: true,
					})
				}
			>
				<Tab.List
					as="div"
					className="bg-white dark:bg-gray-850 flex flex-col w-64 overflow-x-hidden top-12 bottom-0 fixed py-2"
				>
					<TabItem>Topic Settings</TabItem>
					<TabItem>Topic Appearance</TabItem>
					<TabItem>Moderators</TabItem>
					<TabItem>Rules</TabItem>
				</Tab.List>
				<Tab.Panels
					as="div"
					className="mt-5 container mx-auto max-w-6xl sm:px-5"
				>
					<Card className="p-3 flex flex-col gap-3 ml-64">
						<Tab.Panel as="div" className="flex flex-col gap-2">
							<TopicSettings topic={topicData} />
						</Tab.Panel>
						<Tab.Panel as="div" className="flex flex-col gap-2">
							<TopicAppearance topic={topicData} />
						</Tab.Panel>
						<Tab.Panel as="div" className="flex flex-col gap-2">
							<TopicAddModerator topic={topicData} />
						</Tab.Panel>
						<Tab.Panel as="div" className="flex flex-col gap-2">
							<TopicRules topic={topicData} />
						</Tab.Panel>
					</Card>
				</Tab.Panels>
			</Tab.Group>
		</div>
	);
};

export default Moderation;
