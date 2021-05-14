import React, { useContext } from "react";
import { IconButton, HStack } from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { GlobalContext } from "../context/GlobalState";

const CommentVoting = ({ comment }) => {
	const { user, changeCommentVote } = useContext(GlobalContext);

	const handleUpvote = () => {
		changeCommentVote(comment.topic, comment.post, comment._id, "like");
	};

	const handleDownvote = () => {
		changeCommentVote(comment.topic, comment.post, comment._id, "dislike");
	};

	return (
		<HStack>
			{comment.likes.includes(user._id) ? (
				<IconButton
					onClick={handleUpvote}
					size="xs"
					icon={<ArrowUpIcon color="orange.400" />}
				/>
			) : (
				<IconButton onClick={handleUpvote} size="xs" icon={<ArrowUpIcon />} />
			)}
			<div>{comment.likes.length - comment.dislikes.length}</div>
			{comment.dislikes.includes(user._id) ? (
				<IconButton
					onClick={handleDownvote}
					size="xs"
					icon={<ArrowDownIcon color="blue.600" />}
				/>
			) : (
				<IconButton
					onClick={handleDownvote}
					size="xs"
					icon={<ArrowDownIcon />}
				/>
			)}
		</HStack>
	);
};

export default CommentVoting;
