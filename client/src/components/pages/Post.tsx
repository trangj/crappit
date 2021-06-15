import React from "react";
import PostCard from "../post/PostCard";
import CommentCard from "../comment/CommentCard";
import SkeletonCard from "../utils/SkeletonCard";
import AlertStatus from "../utils/AlertStatus";
import usePost from "../../hooks/post-query/usePost";
import useTopic from "../../hooks/topic-query/useTopic";
import { Container } from "@chakra-ui/layout";
import { RouteComponentProps } from "react-router-dom";

interface MatchParams {
	id: string;
	topic: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

const Post = ({ match }: Props) => {
	const { isLoading, isError, data, error } = usePost(match.params.id);
	const {
		isLoading: topicLoading,
		isError: topicIsError,
		data: topicData,
		error: topicError,
	} = useTopic(match.params.topic);

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
