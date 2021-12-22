import React, { useState } from "react";
import PostItem from "../components/post/PostItem";
import InfiniteScroll from "react-infinite-scroller";
import usePosts, { fetchPosts } from "../hooks/post-query/usePosts";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import Link from "next/link";
import Head from 'next/head';
import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { useRouter } from "next/router";
import PostSkeleton from "src/components/util/PostSkeleton";
import PostLoaderSkeleton from "src/components/util/PostLoaderSkeleton";
import SortPost from "src/components/post/SortPostCard";
import SideBar from "src/components/post/SideBar";
import CreatePostCard from "src/components/post/CreatePostCard";
import ExploreTopicCard from "src/components/topic/ExploreTopicCard";

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
	const router = useRouter();

	const sort = router.query.sort ? router.query.sort as string : "";

	const [sortParam, setSortParam] = useState(sort);
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isLoading,
	} = usePosts("", sortParam);

	return (
		<Container>
			<Head>
				<title>crappit: the front page of the internet</title>
				<meta name="description" content="Crappit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!" />
				<meta property="og:title" content="crappit" />
				<meta property="og:type" content="website" />
				<meta property="og:url" content={`https://${process.env.NEXT_PUBLIC_DOMAIN_NAME}/`} />
				<meta property="og:description" content="Crappit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!" />
			</Head>
			<div className="flex gap-6">
				<div className="w-full">
					<CreatePostCard />
					<SortPost sortParam={sortParam} setSortParam={setSortParam} />
					{!isLoading && data ? (
						<InfiniteScroll
							pageStart={0}
							loadMore={fetchNextPage as (page: number) => void}
							hasMore={hasNextPage}
							loader={<PostLoaderSkeleton key="loader" />}
						>
							{data.pages.map((group, i) => (
								<React.Fragment key={i}>
									{group.posts.map((post) => (
										<PostItem
											post={post}
											key={post.id}
										/>
									))}
								</React.Fragment>
							))}
						</InfiniteScroll>
					) : (
						<>
							<PostSkeleton />
							<PostSkeleton />
						</>
					)}
				</div>
				<SideBar>
					<ExploreTopicCard />
					<Card className="flex flex-col gap-3 p-3">
						<div className="font-semibold">Home</div>
						<div className="content">
							Your personal Crappit frontpage. Come here to check in with your
							favorite topics.
						</div>
						<Link passHref href={`/submit`}>
							<Button variant="filled" fullWidth as="a">
								Create Post
							</Button>
						</Link>
						<Link passHref href={`/t/create`}>
							<Button fullWidth as="a">
								Create Topic
							</Button>
						</Link>
					</Card>
				</SideBar>
			</div>
		</Container>
	);
};

export default HomePage;
