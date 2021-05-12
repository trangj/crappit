import React, { useContext } from "react";
import { VStack, IconButton } from "@chakra-ui/react";
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

	return user ? (
		<VStack mr="4">
			{comment.likes.includes(user._id) ? (
				<IconButton
					disabled
					size="sm"
					icon={<ArrowUpIcon color="orange.400" />}
				/>
			) : (
				<IconButton onClick={handleUpvote} size="sm" icon={<ArrowUpIcon />} />
			)}
			<div>{comment.likes.length - comment.dislikes.length}</div>
			{comment.dislikes.includes(user._id) ? (
				<IconButton
					disabled
					size="sm"
					icon={<ArrowDownIcon color="blue.600" />}
				/>
			) : (
				<IconButton
					onClick={handleDownvote}
					size="sm"
					icon={<ArrowDownIcon />}
				/>
			)}
		</VStack>
	) : null;
};

export default CommentVoting;
