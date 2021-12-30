import React, { useState } from "react";
import PostItem from "../../../components/post/PostItem";
import TopicHeader from "../../../components/topic/TopicHeader";
import InfiniteScroll from "react-infinite-scroller";
import usePosts, { fetchPosts } from "../../../hooks/post-query/usePosts";
import useTopic, { fetchTopic } from "../../../hooks/topic-query/useTopic";
import { useRouter } from "next/router";
import Head from "next/head";
import { GetServerSideProps } from "next";
import TopicCard from "src/components/topic/TopicCard";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import PostSkeleton from "src/components/util/PostSkeleton";
import PostLoaderSkeleton from "src/components/util/PostLoaderSkeleton";
import TopicModeratorCard from "src/components/topic/TopicModeratorCard";
import SortPost from "src/components/post/SortPostCard";
import SideBar from "src/components/post/SideBar";
import CreatePost from "src/components/post/CreatePostCard";

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
	const router = useRouter();

	const topic = router.query.topic;
	const sort = router.query.sort ? router.query.sort as string : "";

	const [sortParam, setSortParam] = useState(sort);
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isError
	} = usePosts(topic as string, sortParam);
	const {
		data: topicData,
	} = useTopic(topic as string);

	if (!topicData) {
		return (
			<div className="fixed inset-y-1/2 w-full text-center">
				topic not found
			</div>
		);
	};

	return (
		<>
			<Head>
				<title>{topicData?.headline || topicData?.title}</title>
				<meta name="description" content={`t/${topicData?.title}: ${topicData?.description.split(" ").splice(0, 20).join(" ")} ...`} />
				<meta property="og:title" content={`t/${topicData?.title}`} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content={`https://${process.env.NEXT_PUBLIC_DOMAIN_NAME}/t/${topicData?.title}`} />
				<meta property="og:description" content={`${topicData?.description.split(" ").splice(0, 20).join(" ")} ...`} />
			</Head>
			<TopicHeader topic={topicData!} />
			<div className="mt-4 container mx-auto max-w-5xl sm:px-5">
				<div className="flex gap-6">
					<div className="w-full">
						<CreatePost url={`/t/${topicData?.title}`} />
						<SortPost sortParam={sortParam} setSortParam={setSortParam} url={`/t/${topicData?.title}`} />
						{!isLoading && data ? (
							<InfiniteScroll
								pageStart={0}
								loadMore={() => fetchNextPage({ cancelRefetch: false })}
								hasMore={!isError && hasNextPage}
								loader={<PostLoaderSkeleton key="loader" />}
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
					<SideBar>
						<TopicCard topicData={topicData!} />
						<TopicModeratorCard topicData={topicData!} />
					</SideBar>
				</div>
			</div>
		</>
	);
};

export default TopicPage;
