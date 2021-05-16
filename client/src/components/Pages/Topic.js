import React from "react";
import PostItem from "../PostItem";
import TopicCard from "../TopicCard";
import SkeletonList from "../Utils/SkeletonList";
import InfiniteScroll from "react-infinite-scroller";
import { Spinner } from "@chakra-ui/react";
import { useQuery, useInfiniteQuery } from "react-query";
import { fetchTopic } from "../../query/post-query";
import { fetchTopicInfo } from "../../query/topic-query";
import AlertStatus from "../Utils/AlertStatus";

const Topic = ({ match }) => {
	const { data, error, fetchNextPage, hasNextPage, isLoading } =
		useInfiniteQuery(
			["posts", match.params.topic],
			({ pageParam = 0 }) => fetchTopic(match.params.topic, pageParam),
			{
				getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
			}
		);

	const {
		isLoading: topicLoading,
		isError: topicIsError,
		data: topicData,
		error: topicError,
	} = useQuery(["topic", match.params.topic], () =>
		fetchTopicInfo(match.params.topic)
	);

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
		</>
	);
};

export default Topic;
