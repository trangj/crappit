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
				<title>{topicData?.headline}</title>
				<meta name="description" content={`t/${topicData?.title}: ${topicData?.description.slice(0, 155)}`} />
				<meta property="og:title" content={`t/${topicData?.title}`} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content={`https://crappit.me/t/${topicData?.title}`} />
				<meta property="twitter:title" content={`t/${topicData?.title}`} />
			</Head>
			<TopicHeader topic={topicData!} />
			<div className="mt-4 container mx-auto max-w-5xl">
				<div className="flex gap-5">
					<div className="w-full">
						<Card className="flex p-2 gap-2">
							<Link passHref href={user ? `/user/${user.id}` : "/login"}>
								<a>
									<Avatar className="h-10 w-10 self-center" />
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
								active={sortParam === ""}
								onClick={() => {
									setSortParam("");
									router.push(`/t/${topicData?.title}/?sort=`, undefined, { shallow: true });
								}}
								variant="ghost"
								icon={<FireIcon className="h-6 w-6 mr-1" />}
							>
								Hot
							</Button>
							<Button
								active={sortParam === "created_at"}
								onClick={() => {
									setSortParam("created_at");
									router.push(`/t/${topicData?.title}/?sort=created_at`, undefined, { shallow: true });
								}}
								variant="ghost"
								icon={<SparklesIcon className="h-6 w-6 mr-1" />}
							>
								New
							</Button>
							<Button
								active={sortParam === "vote"}
								onClick={() => {
									setSortParam("vote");
									router.push(`/t/${topicData?.title}/?sort=vote`, undefined, { shallow: true });
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
								loader={<div>Loading...</div>}
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
							<div>Loading...</div>
						)}
					</div>
					<div className="flex-col w-80 hidden lg:flex">
						<div style={{ width: 'inherit' }}>
							{topicData ? (
								<TopicCard topicData={topicData} />
							) : (
								<div>Loading...</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default TopicPage;
