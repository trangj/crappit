import React, { useContext } from "react";
import PostItem from "../Post/PostItem";
import TopicCard from "../Topic/TopicCard";
import SkeletonList from "../Utils/SkeletonList";
import InfiniteScroll from "react-infinite-scroller";
import {
	Box,
	Button,
	Divider,
	Flex,
	Heading,
	HStack,
	Input,
	Spacer,
	Spinner,
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
	const { data, error, fetchNextPage, hasNextPage, isLoading, isFetching } =
		usePosts(match.params.topic);
	const {
		isLoading: topicLoading,
		isError: topicIsError,
		data: topicData,
		error: topicError,
	} = useTopic(match.params.topic);

	if (isLoading || topicLoading) return <SkeletonList />;
	if (error || topicIsError)
		return <AlertStatus status={error || topicError} />;

	return (
		<>
			<TopicCard topic={topicData.topic} />
			<Flex m="5">
				<Box width="100%">
					<Card>
						<Link to={`/t/${topicData.topic.title}/submit`}>
							<Input placeholder="Create post" />
						</Link>
					</Card>
					<Card>
						<HStack>
							<Button>Hot</Button>
							<Button>New</Button>
							<Button>Top</Button>
						</HStack>
					</Card>
					<InfiniteScroll
						pageStart={0}
						loadMore={fetchNextPage}
						hasMore={!isFetching && hasNextPage}
						loader={<Spinner key={0} mx="auto" display={"block"} />}
					>
						{data.pages.map((group, i) => (
							<React.Fragment key={i}>
								{group.posts.map((post, y) => (
									<PostItem
										post={post}
										key={post.id}
										style={{
											borderRadius: i === 0 && y === 0 && "0.5rem 0.5rem 0 0",
										}}
									/>
								))}
							</React.Fragment>
						))}
					</InfiniteScroll>
				</Box>
				<Flex
					flexDirection="column"
					width="400px"
					ml="5"
					display={{ base: "none", md: "block" }}
				>
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
				</Flex>
			</Flex>
		</>
	);
};

export default Topic;
