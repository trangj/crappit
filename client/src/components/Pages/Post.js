import React from "react";
import PostCard from "../PostCard";
import CommentCard from "../CommentCard";
import SkeletonCard from "../Utils/SkeletonCard";
import AlertStatus from "../Utils/AlertStatus";
import { useQuery } from "react-query";
import { fetchPost } from "../../query/post-query";

const Post = ({ match }) => {
	const { isLoading, isError, data, error } = useQuery(
		["post", match.params.id],
		() => fetchPost(match.params.topic, match.params.id)
	);

	if (isLoading) return <SkeletonCard />;
	if (isError) return <AlertStatus status={error} />;

	return (
		<>
			<PostCard post={data} />
			<CommentCard post={data} />
		</>
	);
};

export default Post;
