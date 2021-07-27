import React from "react";
import useTopic, { fetchTopic } from "../../../hooks/topic-query/useTopic";
import { useUser } from "../../../context/UserState";
import { Card, Container, Divider } from "../../../ui";
import UpdateTopic from "../../../components/topic/UpdateTopic";
import AddModerator from "../../../components/topic/AddModerator";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { QueryClient, useQueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import Head from "next/head";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "../../../axiosConfig";

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
	const queryClient = useQueryClient();
	const { topic } = router.query;
	const { user } = useUser();
	const {
		isLoading: topicLoading,
		data: topicData,
	} = useTopic(topic as string);

	if (!user) {
		router.push('/login');
		return null;
	}
	if (topicLoading || !topicData) return <div>Loading...</div>;

	const handleIcon = async (e: any) => {
		try {
			const file = e.target.files[0];
			if (file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg') throw Error("Invalid file type");
			const formData = new FormData();
			formData.append('file', file);
			const res: any = await axios.post(`/api/topic/${topicData.title}/icon`, formData);
			queryClient.setQueryData(["topic", topicData.title], (initalData: any) => {
				initalData.icon_image_url = res.data.topic.icon_image_url;
				initalData.icon_image_name = res.data.topic.icon_image_name;
				return initalData;
			});
			toast.success(res.data.status.text);
		} catch (err) {
			toast.error(err.message);
		}
	};

	const handleBanner = async (e: any) => {
		try {
			const file = e.target.files[0];
			if (file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg') throw Error("Invalid file type");
			const formData = new FormData();
			formData.append('file', file);
			const res: any = await axios.post(`/api/topic/${topicData.title}/banner`, formData);
			queryClient.setQueryData(["topic", topicData.title], (initalData: any) => {
				initalData.image_url = res.data.topic.image_url;
				initalData.image_name = res.data.topic.image_name;
				return initalData;
			});
			toast.success(res.data.status.text);
		} catch (err) {
			toast.error(err.message);
		}
	};

	return (
		<Container>
			<Head>
				<title>{topicData.title}</title>
			</Head>
			{topicData.user_moderator_id === user.id ? (
				<Card className="p-3 flex flex-col gap-3" >
					<h6 >Topic Settings</h6>
					<Divider className="my-1" />
					<UpdateTopic topic={topicData} />
					<h6>Topic Appearance</h6>
					<Divider className="my-1" />
					<p className="font-medium">Topic Icon</p>
					<input type="file" accept=".png,.jpg,.jpeg" onChange={handleIcon} />
					<small className="text-gray-500 dark:text-gray-400">Required Size: 256x256px</small>
					<p className="font-medium">Topic Banner</p>
					<input type="file" accept=".png,.jpg,.jpeg" onChange={handleBanner} />
					<small className="text-gray-500 dark:text-gray-400">Recommended upload size: 4,000x128px</small>
					<h6 >Moderators</h6>
					<Divider className="my-1" />
					<div className="flex flex-col">
						{topicData.moderators.map((user, i) => (
							<Link passHref href={`/user/${user.user_id}`} key={i}>
								<a>
									u/{user.username}
								</a>
							</Link>
						))}
					</div>
					<AddModerator topic={topicData} />
				</Card>
			) : (
				<div>You are not a moderator of this topic</div>
			)}
		</Container>
	);
};

export default Moderation;
