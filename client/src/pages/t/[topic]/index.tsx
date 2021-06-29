import React, { useState } from "react";
import PostItem from "../../../components/post/PostItem";
import TopicCard from "../../../components/topic/TopicCard";
import SkeletonList from "../../../components/utils/SkeletonList";
import InfiniteScroll from "react-infinite-scroller";
import {
	Avatar,
	Box,
	Button,
	Divider,
	Flex,
	Heading,
	HStack,
	Input,
	Skeleton,
	Spacer,
	Text,
} from "@chakra-ui/react";
import usePosts from "../../../hooks/post-query/usePosts";
import useTopic from "../../../hooks/topic-query/useTopic";
import AlertStatus from "../../../components/utils/AlertStatus";
import Card from "../../../components/utils/Card";
import Link from "next/link";
import { useUser } from "../../../context/UserState";
import dayjs from "dayjs";
import { useRouter } from "next/router";

const Topic = () => {
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
			{topicData ? (
				<TopicCard topic={topicData.topic} />
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
								href={topicData ? `/t/${topicData.topic.title}/submit` : "/"}
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
					display={{ base: "none", md: "block" }}
				>
					<Box width="inherit">
						{topicData ? (
							<Card>
								<Flex>
									<Heading size="md">About Community</Heading>
									<Spacer />
									{user && topicData.topic.user_moderator_id && (
										<Link
											href={`/t/${topicData.topic.title}/moderation`}
											passHref
										>
											<Button
												as="a"
												size="sm"
											>
												Settings
											</Button>
										</Link>
									)}
								</Flex>
								<Text pt="4">{topicData.topic.description}</Text>
								<Divider pt="2" />
								<Text pt="2">
									Created {dayjs(topicData.topic.created_at).format("LL")}
								</Text>
								<Link passHref href={`/t/${topicData.topic.title}/submit`}>
									<Button
										as="a"
										mt="2"
										isFullWidth
									>
										Add Post
									</Button>
								</Link>
							</Card>
						) : (
							<Skeleton width="100%" height="300px" borderRadius="md" />
						)}
					</Box>
				</Flex>
			</Flex>
		</>
	);
};

export default Topic;
