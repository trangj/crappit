import React from "react";
import PostCard from "../../../../../components/post/PostCard";
import CommentCard from "../../../../../components/comment/CommentCard";
import SkeletonCard from "../../../../../components/utils/SkeletonCard";
import AlertStatus from "../../../../../components/utils/AlertStatus";
import usePost from "../../../../../hooks/post-query/usePost";
import useTopic from "../../../../../hooks/topic-query/useTopic";
import { Container } from "@chakra-ui/layout";
import { useRouter } from "next/router";

const Post = () => {
	const router = useRouter();
	const { id, topic } = router.query;
	const { isLoading, isError, data, error } = usePost(id as string);
	const {
		isLoading: topicLoading,
		isError: topicIsError,
		data: topicData,
		error: topicError,
	} = useTopic(topic as string);

	if (isError || topicIsError)
		return <AlertStatus status={error || topicError} />;
	if (isLoading || topicLoading || !data || !topicData) return <SkeletonCard />;

	return (
		<Container>
			<PostCard post={data} topic={topicData.topic} />
			<CommentCard post={data} topic={topicData.topic} />
		</Container>
	);
};

export default Post;
