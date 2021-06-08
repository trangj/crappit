import React, { useState } from "react";
import PostItem from "../Post/PostItem";
import SkeletonList from "../Utils/SkeletonList";
import InfiniteScroll from "react-infinite-scroller";
import {
	Button,
	Flex,
	Spinner,
	Box,
	Input,
	HStack,
	Text,
	Heading,
} from "@chakra-ui/react";
import usePosts from "../../hooks/post-query/usePosts";
import AlertStatus from "../Utils/AlertStatus";
import Card from "../Utils/Card";
import { Link } from "react-router-dom";

const Home = () => {
	const [sortParam, setSortParam] = useState("");
	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isError,
		isFetching,
	} = usePosts("", sortParam);

	if (isError) return <AlertStatus status={error} />;
	return (
		<Flex m="5">
			<Box width="100%">
				<Card>
					<Link to={`/submit`}>
						<Input placeholder="Create post" />
					</Link>
				</Card>
				<Card>
					<HStack>
						<Button
							isActive={sortParam === ""}
							onClick={() => setSortParam("")}
						>
							Random
						</Button>
						<Button
							isActive={sortParam === "created_at"}
							onClick={() => setSortParam("created_at")}
						>
							New
						</Button>
						<Button
							isActive={sortParam === "vote"}
							onClick={() => setSortParam("vote")}
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
				) : (
					<SkeletonList />
				)}
			</Box>
			<Flex
				flexDirection="column"
				width="400px"
				ml="5"
				display={{ base: "none", md: "block" }}
			>
				<Card>
					<Heading size="md">Home</Heading>
					<Text>
						Your personal Crappit frontpage. Come here to check in with your
						favorite communities.
					</Text>
					<Button as={Link} to={`/submit`} mt="2" isFullWidth>
						Create Post
					</Button>
					<Button as={Link} to={`/submit`} mt="2" isFullWidth>
						Create Topic
					</Button>
				</Card>
			</Flex>
		</Flex>
	);
};

export default Home;
