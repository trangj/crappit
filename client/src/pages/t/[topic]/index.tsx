import React, { useState } from "react";
import PostItem from "../../../components/post/PostItem";
import TopicHeader from "../../../components/topic/TopicHeader";
import SkeletonList from "../../../components/utils/SkeletonList";
import InfiniteScroll from "react-infinite-scroller";
import {
	Avatar,
	Box,
	Button,
	Flex,
	HStack,
	Input,
	Skeleton,
} from "@chakra-ui/react";
import usePosts, { fetchPosts } from "../../../hooks/post-query/usePosts";
import useTopic, { fetchTopic } from "../../../hooks/topic-query/useTopic";
import AlertStatus from "../../../components/utils/AlertStatus";
import Card from "../../../components/utils/Card";
import Link from "next/link";
import { useUser } from "../../../context/UserState";
import { useRouter } from "next/router";
import Head from "next/head";
import { GetServerSideProps } from "next";
import TopicCard from "src/components/topic/TopicCard";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(['topic', query.topic], () => fetchTopic(query.topic as string));
	await queryClient.prefetchInfiniteQuery(['posts', query.topic, ''], () => fetchPosts(query.topic as string, 0, ''));
	return {
		props: {
			dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient)))
		}
	};
};

const TopicPage = () => {
	const router = useRouter();
	const { topic } = router.query;
	const { user } = useUser();
	const [sortParam, setSortParam] = useState("");
	const { data, error, fetchNextPage, hasNextPage, isLoading, isFetching } =
		usePosts(topic as string, sortParam);
	const {
		isError: topicIsError,
		data: topicData,
		error: topicError,
	} = useTopic(topic as string);

	if (error || topicIsError)
		return <AlertStatus status={error || topicError} />;

	return (
		<>
			<Head>
				<title>{topicData?.headline}</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta name="description" content={`t/${topicData?.title}: ${topicData?.description.slice(0, 155)}`} />
			</Head>
			{topicData ? (
				<TopicHeader topic={topicData} />
			) : (
				<Skeleton width="100%" height="200px" />
			)}
			<Flex px={{ base: "0", sm: "5" }} py="5">
				<Box width="100%">
					<Card>
						<HStack>
							<Link passHref href={user ? `/user/${user.id}` : "/login"}>
								<Avatar
									size="sm"
									as="a"

								/>
							</Link>
							<Link
								passHref
								href={topicData ? `/t/${topicData.title}/submit` : "/"}
							>
								<Input placeholder="Create post" style={{ width: "100%" }} />
							</Link>
						</HStack>
					</Card>
					<Card>
						<HStack>
							<Button
								isActive={sortParam === ""}
								onClick={() => setSortParam("")}
								variant="ghost"
							>
								Hot
							</Button>
							<Button
								isActive={sortParam === "created_at"}
								onClick={() => setSortParam("created_at")}
								variant="ghost"
							>
								New
							</Button>
							<Button
								isActive={sortParam === "vote"}
								onClick={() => setSortParam("vote")}
								variant="ghost"
							>
								Top
							</Button>
						</HStack>
					</Card>
					{!isLoading && data ? (
						<InfiniteScroll
							pageStart={0}
							loadMore={fetchNextPage as (page: number) => void}
							hasMore={!isFetching && hasNextPage}
							loader={<Skeleton height="105px" width="100%" key="skeleton" />}
						>
							{data.pages.map((group, i) => (
								<React.Fragment key={i}>
									{group.posts.map((post, y) => (
										<PostItem
											post={post}
											key={post.id}
											borderTopRadius={i === 0 && y === 0 ? "md" : "none"}
										/>
									))}
								</React.Fragment>
							))}
						</InfiniteScroll>
					) : (
						<SkeletonList />
					)}
				</Box>
				<Flex
					flexDirection="column"
					width="312px"
					ml="5"
					display={{ base: "none", lg: "block" }}
				>
					<Box width="inherit">
						{topicData ? (
							<TopicCard topicData={topicData} />
						) : (
							<Skeleton width="100%" height="300px" borderRadius="md" />
						)}
					</Box>
				</Flex>
			</Flex>
		</>
	);
};

export default TopicPage;
