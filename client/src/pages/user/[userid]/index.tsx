import React, { useState } from "react";
import useProfile, { fetchProfile } from "../../../hooks/user-query/useProfile";
import useProfilePosts, { fetchProfilePosts } from "../../../hooks/user-query/useProfilePosts";
import { Button, Card, Container } from "../../../ui";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { FireIcon, SparklesIcon, ChartBarIcon } from "@heroicons/react/solid";
import Image from 'next/image';
import InfiniteScroll from "react-infinite-scroller";
import PostLoaderSkeleton from "src/components/util/PostLoaderSkeleton";
import PostSkeleton from "src/components/util/PostSkeleton";
import PostItem from "src/components/post/PostItem";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const sort = query.sort ? query.sort as string : "";
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(["profile", query.userid], () => fetchProfile(query.userid as string));
	await queryClient.prefetchInfiniteQuery(['profile', 'posts', query.userid, sort], () => fetchProfilePosts(query.userid as string, 0, sort));
	return {
		props: {
			dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient)))
		}
	};
};

const Profile = () => {
	const router = useRouter();
	const { userid } = router.query;
	const sort = router.query.sort ? router.query.sort as string : "";
	const [sortParam, setSortParam] = useState(sort);
	const {
		data: profile,
	} = useProfile(userid as string);
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isLoading,
		isFetching
	} = useProfilePosts(userid as string, sortParam);

	return (
		<Container>
			<Head>
				<title>u/{profile?.username} - Crappit</title>
				<meta name="description" content={`u/${profile?.username}`} />
				<meta property="og:title" content={`u/${profile?.username} - Crappit`} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content={`https://crappit.me/user${profile?.id}`} />
			</Head>
			<div className="flex gap-5">
				<div className="w-full">
					<Card className="flex gap-2 p-3">
						<Button
							onClick={() => {
								router.push(`/user/${profile?.id}?sort=hot`, undefined, { shallow: true });
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
								router.push(`/user/${profile?.id}?sort=new`, undefined, { shallow: true });
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
								router.push(`/user/${profile?.id}?sort=top`, undefined, { shallow: true });
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
									{group.posts.map((post, y) => (
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
						<Card>
							<div className="h-24 bg-blue-400" />
							<div className="-mt-16 ml-3 h-20 w-20 border-4 rounded bg-gray-300 dark:bg-gray-500">
								{profile && profile.avatar_image_name && <Image src={profile.avatar_image_name} alt="user avatar" height={80} width={80} />}
							</div>
							<div className="p-3 gap-3 flex flex-col">
								<small className="font-medium">u/{profile?.username}</small>
								<div className="flex flex-col">
									<small className="font-medium">Cake Day</small>
									<small>{dayjs(profile?.created_at).format('MMMM D, YYYY')}</small>
								</div>
							</div>
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

export default Profile;
