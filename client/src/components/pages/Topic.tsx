import React, { useContext, useState } from "react";
import PostItem from "../post/PostItem";
import TopicCard from "../topic/TopicCard";
import SkeletonList from "../utils/SkeletonList";
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
import usePosts from "../../hooks/post-query/usePosts";
import useTopic from "../../hooks/topic-query/useTopic";
import AlertStatus from "../utils/AlertStatus";
import Card from "../utils/Card";
import { Link, RouteComponentProps } from "react-router-dom";
import { UserContext } from "../../context/UserState";
import dayjs from "dayjs";

interface MatchParams {
	topic: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

const Topic = ({ match }: Props) => {
	const { user } = useContext(UserContext);
	const [sortParam, setSortParam] = useState("number_of_comments");
	const { data, error, fetchNextPage, hasNextPage, isLoading, isFetching } =
		usePosts(match.params.topic, sortParam);
	const {
		isError: topicIsError,
		data: topicData,
		error: topicError,
	} = useTopic(match.params.topic);

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
							<Avatar
								size="sm"
								as={Link}
								to={user ? `/user/${user.id}` : "/login"}
							/>
							<Link
								to={topicData ? `/t/${topicData.topic.title}/submit` : "/"}
								style={{ width: "100%" }}
							>
								<Input placeholder="Create post" />
							</Link>
						</HStack>
					</Card>
					<Card>
						<HStack>
							<Button
								isActive={sortParam === "number_of_comments"}
								onClick={() => setSortParam("number_of_comments")}
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
										<>
											<Button
												as={Link}
												to={`/t/${topicData.topic.title}/moderation`}
												size="sm"
											>
												Settings
											</Button>
										</>
									)}
								</Flex>
								<Text pt="4">{topicData.topic.description}</Text>
								<Divider pt="2" />
								<Text pt="2">
									Created {dayjs(topicData.topic.created_at).format("LL")}
								</Text>
								<Button
									as={Link}
									to={`/t/${topicData.topic.title}/submit`}
									mt="2"
									isFullWidth
								>
									Add Post
								</Button>
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
