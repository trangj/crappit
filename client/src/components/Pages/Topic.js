import React, { useContext, useState } from "react";
import PostItem from "../Post/PostItem";
import TopicCard from "../Topic/TopicCard";
import SkeletonList from "../Utils/SkeletonList";
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
import AlertStatus from "../Utils/AlertStatus";
import Card from "../Utils/Card";
import { Link } from "react-router-dom";
import moment from "moment";
import { UserContext } from "../../context/UserState";

const Topic = ({ match }) => {
	const { user } = useContext(UserContext);
	const [sortParam, setSortParam] = useState("");
	const { data, error, fetchNextPage, hasNextPage, isLoading, isFetching } =
		usePosts(match.params.topic, sortParam);
	const {
		isLoading: topicLoading,
		isError: topicIsError,
		data: topicData,
		error: topicError,
	} = useTopic(match.params.topic);

	if (error || topicIsError)
		return <AlertStatus status={error || topicError} />;

	return (
		<>
			{!topicLoading ? (
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
								to={!topicLoading && `/t/${topicData.topic.title}/submit`}
								style={{ width: "100%" }}
							>
								<Input placeholder="Create post" />
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
								Random
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
					{!isLoading ? (
						<InfiniteScroll
							pageStart={0}
							loadMore={fetchNextPage}
							hasMore={!isFetching && hasNextPage}
							loader={<Skeleton height="105px" width="100%" />}
						>
							{data.pages.map((group, i) => (
								<React.Fragment key={i}>
									{group.posts.map((post, y) => (
										<PostItem
											post={post}
											key={post.id}
											borderTopRadius={i === 0 && y === 0 && "md"}
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
						{!topicLoading ? (
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
									Created {moment(topicData.topic.created_at).format("LL")}
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
