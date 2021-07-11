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
import Card from "../components/utils/Card";
import Link from "next/link";
import Head from 'next/head';
import { useUser } from "../context/UserState";
import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const sort = query.sort ? query.sort as string : "";
	const queryClient = new QueryClient();
	await queryClient.prefetchInfiniteQuery(['posts', '', sort], () => fetchPosts('', 0, sort));
	return {
		props: {
			dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient)))
		}
	};
};

const HomePage = () => {
	const { user } = useUser();
	const router = useRouter();

	const sort = router.query.sort ? router.query.sort as string : "";

	const [sortParam, setSortParam] = useState(sort);
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isFetching,
	} = usePosts("", sortParam);

	return (
		<>
			<Head>
				<title>crappit: the front page of the internet</title>
				<meta name="description" content="Crappit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!" />
				<meta property="og:title" content="crappit" />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://crappit.me/" />
				<meta property="twitter:title" content="reddit" />
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
								onClick={() => {
									router.push('/?sort=', undefined, { shallow: true });
									setSortParam("");
								}}
								variant="ghost"
							>
								Hot
							</Button>
							<Button
								isActive={sortParam === "created_at"}
								onClick={() => {
									router.push('/?sort=created_at', undefined, { shallow: true });
									setSortParam("created_at");
								}}
								variant="ghost"
							>
								New
							</Button>
							<Button
								isActive={sortParam === "vote"}
								onClick={() => {
									router.push('/?sort=vote', undefined, { shallow: true });
									setSortParam("vote");
								}}
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
