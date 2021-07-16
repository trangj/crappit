import React, { useState } from "react";
import PostItem from "../components/post/PostItem";
import InfiniteScroll from "react-infinite-scroller";
import usePosts, { fetchPosts } from "../hooks/post-query/usePosts";
import { Card } from "../ui";
import Link from "next/link";
import Head from 'next/head';
import { useUser } from "../context/UserState";
import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { useRouter } from "next/router";
import { FireIcon, SparklesIcon, ChartBarIcon } from '@heroicons/react/solid';
import { Button } from "src/ui";
import { Avatar } from "src/ui";

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
		<div className="mt-16 container mx-auto max-w-5xl">
			<Head>
				<title>crappit: the front page of the internet</title>
				<meta name="description" content="Crappit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!" />
				<meta property="og:title" content="crappit" />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://crappit.me/" />
				<meta property="twitter:title" content="reddit" />
			</Head>
			<div className="flex gap-5">
				<div className="w-full">
					<Card className="flex p-2 gap-2">
						<Link passHref href={user ? `/user/${user.id}` : "/login"}>
							<a>
								<Avatar className="h-10 w-10 self-center" />
							</a>
						</Link>
						<Link passHref href={`/submit`}>
							<a className="w-full">
								<input placeholder="Create post" className="w-full py-2 px-4 bg-gray-100 hover:bg-white hover:border-blue-500 dark:bg-gray-800 border dark:border-gray-700 dark:hover:border-white dark:hover:bg-gray-900 rounded" />
							</a>
						</Link>
					</Card>
					<Card className="flex gap-2 p-3">
						<Button
							onClick={() => {
								router.push('/?sort=', undefined, { shallow: true });
								setSortParam("");
							}}
							variant="ghost"
							active={sortParam === ""}
						>
							<FireIcon className="h-6 w-6" />
							Hot
						</Button>
						<Button
							onClick={() => {
								router.push('/?sort=created_at', undefined, { shallow: true });
								setSortParam("created_at");
							}}
							variant="ghost"
							active={sortParam === "created_at"}
						>
							<SparklesIcon className="h-6 w-6" />
							New
						</Button>
						<Button
							onClick={() => {
								router.push('/?sort=vote', undefined, { shallow: true });
								setSortParam("vote");
							}}
							variant="ghost"
							active={sortParam === "vote"}
						>
							<ChartBarIcon className="h-6 w-6" />
							Top
						</Button>
					</Card>
					{!isLoading && data ? (
						<InfiniteScroll
							pageStart={0}
							loadMore={fetchNextPage as (page: number) => void}
							hasMore={!isFetching && hasNextPage}
							loader={<div>Loading...</div>}
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
						<div>Loading...</div>
					)}
				</div>
				<div className="flex-col w-80 hidden lg:flex">
					<div style={{ width: 'inherit' }}>
						<Card className="flex flex-col gap-3 p-3">
							<h6>Home</h6>
							<p>
								Your personal Crappit frontpage. Come here to check in with your
								favorite topics.
							</p>
							<Link passHref href={`/submit`}>
								<Button variant="filled" fullWidth as="a">
									Create Post
								</Button>
							</Link>
							<Link passHref href={`/t/submit`}>
								<Button fullWidth as="a">
									Create Topic
								</Button>
							</Link>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
