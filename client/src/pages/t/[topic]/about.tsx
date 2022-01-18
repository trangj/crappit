import React, { Fragment } from "react";
import useTopic, { fetchTopic } from "../../../hooks/topic-query/useTopic";
import { useUser } from "../../../context/UserState";
import { Card } from "../../../ui/Card";
import { Divider } from "../../../ui/Divider";
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
import { Tab } from "@headlessui/react";
import DeleteModerator from "src/components/topic/DeleteModerator";

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
	if (!req.cookies['crappit_session']) {
		return {
			redirect: {
				destination: '/login',
				permanent: false
			}
		};
	}
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
	const { topic, page } = router.query;
	const { user } = useUser();
	const {
		isLoading: topicLoading,
		data: topicData,
	} = useTopic(topic as string);

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

	if (topicData.user_moderator_id !== user?.id) {
		return (
			<div style={{ top: '50%', position: 'fixed', width: '100%', textAlign: 'center' }}>
				You are not a moderator of this topic
			</div>
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
				onChange={(i) => router.push(`/t/${topicData.title}/about?page=${i}`, undefined, { shallow: true })}
			>
				<Tab.List as="div" className="bg-white dark:bg-gray-850 flex flex-col w-64 overflow-x-hidden overflow-y-scroll top-12 bottom-0 fixed py-2">
					<Tab as={Fragment}>
						{({ selected }) => (
							<div className={`menu-option cursor-pointer ${selected ? 'button-ghost-active' : ''}`}>
								Topic Settings
							</div>
						)}
					</Tab>
					<Tab as={Fragment}>
						{({ selected }) => (
							<div className={`menu-option cursor-pointer ${selected ? 'button-ghost-active' : ''}`}>
								Topic Appearance
							</div>
						)}
					</Tab>
					<Tab as={Fragment}>
						{({ selected }) => (
							<div className={`menu-option cursor-pointer ${selected ? 'button-ghost-active' : ''}`}>
								Moderators
							</div>
						)}
					</Tab>
				</Tab.List>
				<Tab.Panels as="div" className="mt-5 container mx-auto max-w-6xl sm:px-5">
					<Card className="p-3 flex flex-col gap-3 ml-64" >
						<Tab.Panel as="div" className="flex flex-col gap-2">
							<h6 >Topic Settings</h6>
							<Divider className="my-1" />
							<UpdateTopic topic={topicData} />
						</Tab.Panel>
						<Tab.Panel as="div" className="flex flex-col gap-2">
							<h6>Topic Appearance</h6>
							<Divider className="my-1" />
							<div className="font-medium">Topic Icon</div>
							<input type="file" accept=".png,.jpg,.jpeg" onChange={handleIcon} />
							<small className="text-gray-500 dark:text-gray-400">Required Size: 256x256px</small>
							<div className="font-medium">Topic Banner</div>
							<input type="file" accept=".png,.jpg,.jpeg" onChange={handleBanner} />
							<small className="text-gray-500 dark:text-gray-400">Recommended upload size: 4,000x128px</small>
						</Tab.Panel>
						<Tab.Panel as="div" className="flex flex-col gap-2">
							<h6 >Moderators</h6>
							<Divider className="my-1" />
							<AddModerator topic={topicData} />
							<div className="flex flex-col mt-2">
								{topicData.moderators.map((user, i) => (
									<div className="flex items-center py-2 border-t border-gray-300 dark:border-gray-700" key={i}>
										<Link passHref href={`/user/${user.user_id}`}>
											<a>
												u/{user.username}
											</a>
										</Link>
										<DeleteModerator topic={topicData} user={user} />
									</div>
								))}
							</div>
						</Tab.Panel>
					</Card>
				</Tab.Panels>
			</Tab.Group>
		</div>
	);
};

export default Moderation;
