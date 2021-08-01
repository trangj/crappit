import React, { useState } from "react";
import useProfile, { fetchProfile } from "../../../hooks/user-query/useProfile";
import useProfilePosts, { fetchProfilePosts } from "../../../hooks/user-query/useProfilePosts";
import { Container } from "../../../ui";
import { useRouter } from "next/router";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import InfiniteScroll from "react-infinite-scroller";
import PostLoaderSkeleton from "src/components/util/PostLoaderSkeleton";
import PostSkeleton from "src/components/util/PostSkeleton";
import PostItem from "src/components/post/PostItem";
import SortPost from "src/components/post/SortPostCard";
import SideBar from "src/components/post/SideBar";
import UserCard from "src/components/user/UserCard";

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
					<SortPost setSortParam={setSortParam} sortParam={sortParam} url={`/user/${profile?.id}`} />
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
				<SideBar>
					<UserCard profile={profile!} />
				</SideBar>
			</div>
		</Container>
	);
};

export default Profile;
