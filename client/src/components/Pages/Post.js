import React from "react";
import PostCard from "../Post/PostCard";
import CommentCard from "../Comment/CommentCard";
import SkeletonCard from "../Utils/SkeletonCard";
import AlertStatus from "../Utils/AlertStatus";
import usePost from "../../hooks/post-query/usePost";

const Post = ({ match }) => {
	const { isLoading, isError, data, error } = usePost(match.params.id);

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
