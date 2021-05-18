import React from "react";
import PostItem from "../Post/PostItem";
import TopicCard from "../Topic/TopicCard";
import SkeletonList from "../Utils/SkeletonList";
import InfiniteScroll from "react-infinite-scroller";
import { Spinner } from "@chakra-ui/react";
import usePosts from "../../hooks/post-query/usePosts";
import useTopic from "../../hooks/topic-query/useTopic";
import AlertStatus from "../Utils/AlertStatus";

const Topic = ({ match }) => {
	const { data, error, fetchNextPage, hasNextPage, isLoading } = usePosts(
		match.params.topic
	);
	const {
		isLoading: topicLoading,
		isError: topicIsError,
		data: topicData,
		error: topicError,
	} = useTopic(match.params.topic);

	if (isLoading || topicLoading) return <SkeletonList />;
	if (error || topicIsError)
		return <AlertStatus status={error || topicError} />;

	return (
		<>
			<TopicCard topic={topicData.topic} />
			<InfiniteScroll
				pageStart={0}
				loadMore={fetchNextPage}
				hasMore={hasNextPage}
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
		</>
	);
};

export default Topic;
