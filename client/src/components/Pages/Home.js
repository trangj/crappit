import React, { useContext, useState } from "react";
import PostItem from "../Post/PostItem";
import SkeletonList from "../Utils/SkeletonList";
import InfiniteScroll from "react-infinite-scroller";
import {
	Button,
	Flex,
	Box,
	Input,
	HStack,
	Text,
	Heading,
	Avatar,
	Skeleton,
} from "@chakra-ui/react";
import usePosts from "../../hooks/post-query/usePosts";
import AlertStatus from "../Utils/AlertStatus";
import Card from "../Utils/Card";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserState";

const Home = () => {
	const { user } = useContext(UserContext);
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
		<Flex mx={{ base: "0", sm: "5" }} my="5">
			<Box width="100%">
				<Card>
					<HStack>
						<Avatar
							size="sm"
							as={Link}
							to={user ? `/user/${user.id}` : "/login"}
						/>
						<Link to={`/submit`} style={{ width: "100%" }}>
							<Input placeholder="Create post" />
						</Link>
					</HStack>
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
						loader={<Skeleton height="105px" width="100%" />}
					>
						{data.pages.map((group, i) => (
							<React.Fragment key={i}>
								{group.posts.map((post, y) => (
									<PostItem
										post={post}
										key={post.id}
										borderTopRadius={i === 0 && y === 0 && "lg"}
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
				</Box>
			</Flex>
		</Flex>
	);
};

export default Home;
