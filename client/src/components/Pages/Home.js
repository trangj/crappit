import React from "react";
import PostItem from "../Post/PostItem";
import SkeletonList from "../Utils/SkeletonList";
import InfiniteScroll from "react-infinite-scroller";
import { Spinner } from "@chakra-ui/react";
import usePosts from "../../hooks/post-query/usePosts";
import AlertStatus from "../Utils/AlertStatus";

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
		<InfiniteScroll
			pageStart={0}
			loadMore={fetchNextPage}
			hasMore={!isFetching && hasNextPage}
			loader={<Spinner key={0} mx="auto" display={"block"} />}
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
