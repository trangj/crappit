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
import { Button, Avatar, Container } from "src/ui";
import PostSkeleton from "src/components/util/PostSkeleton";
import PostLoaderSkeleton from "src/components/util/PostLoaderSkeleton";
import Image from 'next/image';

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
		<Container>
			<Head>
				<title>crappit: the front page of the internet</title>
				<meta name="description" content="Crappit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!" />
				<meta property="og:title" content="crappit" />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://crappit.me/" />
				<meta property="og:description" content="Crappit is a network of communities based on people's interests. Find communities you're interested in, and become part of an online community!" />
			</Head>
			<div className="flex gap-5">
				<div className="w-full">
					<Card className="flex p-2 gap-2">
						<Link passHref href={user ? `/user/${user.id}` : "/login"}>
							<a>
								{!user.avatar_image_name ? <Avatar className="h-10 w-10" /> : <Image alt="user avatar" src={user.avatar_image_name} width={40} height={40} className="rounded-full" />}
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
								router.push('/?sort=hot', undefined, { shallow: true });
								setSortParam("hot");
							}}
							variant="ghost"
							active={sortParam === "hot" || sortParam === ""}
							icon={<FireIcon className="h-6 w-6 mr-1" />}
						>
							Hot
						</Button>
						<Button
							onClick={() => {
								router.push('/?sort=new', undefined, { shallow: true });
								setSortParam("new");
							}}
							variant="ghost"
							active={sortParam === "new"}
							icon={<SparklesIcon className="h-6 w-6 mr-1" />}
						>
							New
						</Button>
						<Button
							onClick={() => {
								router.push('/?sort=top', undefined, { shallow: true });
								setSortParam("top");
							}}
							variant="ghost"
							active={sortParam === "top"}
							icon={<ChartBarIcon className="h-6 w-6 mr-1" />}
						>
							Top
						</Button>
					</Card>
					{!isLoading && data ? (
						<InfiniteScroll
							pageStart={0}
							loadMore={fetchNextPage as (page: number) => void}
							hasMore={!isFetching && hasNextPage}
							loader={<PostLoaderSkeleton />}
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
				<div className="flex-col w-80 hidden lg:flex">
					<div style={{ width: 'inherit' }}>
						<Card className="flex flex-col gap-3 p-3">
							<p className="font-semibold">Home</p>
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
					<div className="sticky mt-12 flex justify-center" style={{ top: 'calc(100vh - 8px)', transform: 'translateY(-100%)' }}>
						<Button variant="filled" onClick={() => document.documentElement.scrollTop = 0}>
							Back to Top
						</Button>
					</div>
				</div>
			</div>
		</Container>
	);
};

export default HomePage;
