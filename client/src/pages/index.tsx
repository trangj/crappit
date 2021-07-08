import React, { useState } from "react";
import PostItem from "../components/post/PostItem";
import SkeletonList from "../components/utils/SkeletonList";
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
import usePosts, { fetchPosts } from "../hooks/post-query/usePosts";
import AlertStatus from "../components/utils/AlertStatus";
import Card from "../components/utils/Card";
import Link from "next/link";
import Head from 'next/head';
import { useUser } from "../context/UserState";
import { GetServerSideProps } from "next";
import { Post } from "src/types/entities/post";

type HomePageProps = {
	initialPosts: {
		posts: Post[],
		nextCursor: number;
	};
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	const initialPosts = await fetchPosts("", 0, "");
	return {
		props: {
			initialPosts
		}
	};
};

const HomePage = ({ initialPosts }: HomePageProps) => {
	const { user } = useUser();
	const [sortParam, setSortParam] = useState("");
	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isError,
		isFetching,
	} = usePosts("", sortParam, initialPosts);

	if (isError) return <AlertStatus status={error} />;

	return (
		<>
			<Head>
				<title>crappit: the front page of the internet</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
				<meta name="description" content="Crappit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!" />
			</Head>
			<Flex px={{ base: "0", sm: "5" }} py="5">
				<Box width="100%">
					<Card>
						<HStack>
							<Link passHref href={user ? `/user/${user.id}` : "/login"}>
								<Avatar as="a" size="sm" />
							</Link>
							<Link passHref href={`/submit`}>
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
											borderTopRadius={i === 0 && y === 0 ? "md" : ""}
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
						<Card>
							<Heading size="md">Home</Heading>
							<Text>
								Your personal Crappit frontpage. Come here to check in with your
								favorite topics.
							</Text>
							<Link passHref href={`/submit`}>
								<Button as="a" mt="2" isFullWidth>
									Create Post
								</Button>
							</Link>
							<Link passHref href={`/t/submit`}>
								<Button as="a" mt="2" isFullWidth>
									Create Topic
								</Button>
							</Link>
						</Card>
					</Box>
				</Flex>
			</Flex>
		</>
	);
};

export default HomePage;
