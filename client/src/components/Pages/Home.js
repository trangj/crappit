import React from "react";
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
	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isError,
		isFetching,
	} = usePosts("");

	if (isLoading) return <SkeletonList />;
	if (isError) return <AlertStatus status={error} />;
	return (
		<Flex m="2">
			<Box width="100%">
				<Card>
					<Link to={`/submit`}>
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
							{group.posts.map((post) => (
								<PostItem post={post} key={post.id} />
							))}
						</React.Fragment>
					))}
				</InfiniteScroll>
			</Box>
			<Flex
				flexDirection="column"
				width="400px"
				ml="2"
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
