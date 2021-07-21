import React, { useState } from "react";
import PostItem from "../../../components/post/PostItem";
import TopicHeader from "../../../components/topic/TopicHeader";
import InfiniteScroll from "react-infinite-scroller";
import usePosts, { fetchPosts } from "../../../hooks/post-query/usePosts";
import useTopic, { fetchTopic } from "../../../hooks/topic-query/useTopic";
import { Card } from "../../../ui";
import Link from "next/link";
import { useUser } from "../../../context/UserState";
import { useRouter } from "next/router";
import Head from "next/head";
import { GetServerSideProps } from "next";
import TopicCard from "src/components/topic/TopicCard";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { FireIcon, SparklesIcon, ChartBarIcon } from '@heroicons/react/solid';
import { Button } from "src/ui";
import { Avatar } from "src/ui";
import PostSkeleton from "src/components/util/PostSkeleton";
import PostLoaderSkeleton from "src/components/util/PostLoaderSkeleton";
import TopicModeratorCard from "src/components/topic/TopicModeratorCard";
import Image from 'next/image';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const sort = query.sort ? query.sort as string : "";
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(['topic', query.topic], () => fetchTopic(query.topic as string));
	await queryClient.prefetchInfiniteQuery(['posts', query.topic, sort], () => fetchPosts(query.topic as string, 0, sort));
	return {
		props: {
			dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient)))
		}
	};
};

const TopicPage = () => {
	const { user } = useUser();
	const router = useRouter();

	const topic = router.query.topic;
	const sort = router.query.sort ? router.query.sort as string : "";

	const [sortParam, setSortParam] = useState(sort);
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isFetching
	} = usePosts(topic as string, sortParam);
	const {
		data: topicData
	} = useTopic(topic as string);

	return (
		<>
			<Head>
				<title>{topicData?.headline || topicData?.title}</title>
				<meta name="description" content={`t/${topicData?.title}: ${topicData?.description.split(" ").splice(0, 20).join(" ")} ...`} />
				<meta property="og:title" content={`t/${topicData?.title}`} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content={`https://crappit.me/t/${topicData?.title}`} />
				<meta property="og:description" content={`${topicData?.description.split(" ").splice(0, 20).join(" ")} ...`} />
			</Head>
			<TopicHeader topic={topicData!} />
			<div className="mt-4 container mx-auto max-w-5xl sm:px-5">
				<div className="flex gap-5">
					<div className="w-full">
						<Card className="flex p-2 gap-2">
							<Link passHref href={user ? `/user/${user.id}` : "/login"}>
								<a>
									{!user || !user.avatar_image_name ? <Avatar className="h-10 w-6" /> : <Image alt="user avatar" src={user.avatar_image_name} width={40} height={40} className="rounded-full" />}
								</a>
							</Link>
							<Link passHref href={`/t/${topicData?.title}/submit`}>
								<a className="w-full">
									<input placeholder="Create post" className="w-full py-2 px-4 bg-gray-100 hover:bg-white hover:border-blue-500 dark:bg-gray-800 border dark:border-gray-700 dark:hover:border-white dark:hover:bg-gray-900 rounded" />
								</a>
							</Link>
						</Card>
						<Card className="flex gap-2 p-3">
							<Button
								active={sortParam === "hot" || sortParam === ""}
								onClick={() => {
									setSortParam("hot");
									router.push(`/t/${topicData?.title}/?sort=hot`, undefined, { shallow: true });
								}}
								variant="ghost"
								icon={<FireIcon className="h-6 w-6 mr-1" />}
							>
								Hot
							</Button>
							<Button
								active={sortParam === "new"}
								onClick={() => {
									setSortParam("new");
									router.push(`/t/${topicData?.title}/?sort=new`, undefined, { shallow: true });
								}}
								variant="ghost"
								icon={<SparklesIcon className="h-6 w-6 mr-1" />}
							>
								New
							</Button>
							<Button
								active={sortParam === "top"}
								onClick={() => {
									setSortParam("top");
									router.push(`/t/${topicData?.title}/?sort=top`, undefined, { shallow: true });
								}}
								variant="ghost"
								icon={<ChartBarIcon className="h-6 w-6 mr-1" />}
							>
								Top
							</Button>
						</Card>
						{!isLoading && data ? (
							<InfiniteScroll
								pageStart={0}
								loadMore={fetchNextPage as (page: number) => void}
								hasMore={!isFetching && hasNextPage}
								loader={<PostLoaderSkeleton />}
							>
								{data.pages.map((group, i) => (
									<React.Fragment key={i}>
										{group.posts.map((post, y) => (
											<PostItem
												post={post}
												key={post.id}
											/>
										))}
									</React.Fragment>
								))}
							</InfiniteScroll>
						) : (
							<>
								<PostSkeleton />
								<PostSkeleton />
							</>
						)}
					</div>
					<div className="flex-col w-80 hidden lg:flex">
						<div style={{ width: 'inherit' }}>
							<TopicCard topicData={topicData!} />
							<TopicModeratorCard topicData={topicData!} />
						</div>
						<div className="sticky mt-12 flex justify-center" style={{ top: 'calc(100vh - 8px)', transform: 'translateY(-100%)' }}>
							<Button variant="filled" onClick={() => document.documentElement.scrollTop = 0}>
								Back to Top
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default TopicPage;
