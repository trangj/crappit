import React, { useEffect, useContext, useState } from "react";
import PostItem from "../PostItem";
import SkeletonList from "../Utils/SkeletonList";
import InfiniteScroll from "react-infinite-scroller";
import { Spinner } from "@chakra-ui/react";
import { useInfiniteQuery } from "react-query";
import { fetchPosts } from "../../query/post-query";

const Home = () => {
	const { data, error, fetchNextPage, hasNextPage, isLoading } =
		useInfiniteQuery(["posts"], ({ pageParam = 0 }) => fetchPosts(pageParam), {
			getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
		});

	return isLoading ? (
		<SkeletonList />
	) : (
		<InfiniteScroll
			pageStart={0}
			loadMore={fetchNextPage}
			hasMore={hasNextPage}
			loader={<Spinner key={0} />}
		>
			{data.pages.map((group, i) => (
				<React.Fragment key={i}>
					{group.posts.map((post) => (
						<PostItem post={post} key={post._id} />
					))}
				</React.Fragment>
			))}
		</InfiniteScroll>
	);
};

export default Home;
