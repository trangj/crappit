import React, { useContext } from "react";
import { IconButton, HStack, Text } from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { UserContext } from "../../context/UserState";
import useCommentVoting from "../../hooks/comment-query/useCommentVoting";

const CommentVoting = ({ comment }) => {
	const { user } = useContext(UserContext);
	const { mutate } = useCommentVoting(comment);
	const handleUpvote = () => {
		mutate({
			topic: comment.topic,
			postid: comment.post,
			commentid: comment._id,
			vote: "like",
		});
	};

	const handleDownvote = () => {
		mutate({
			topic: comment.topic,
			postid: comment.post,
			commentid: comment._id,
			vote: "dislike",
		});
	};

	return (
		<HStack>
			{comment.likes.includes(user._id) ? (
				<IconButton
					onClick={handleUpvote}
					size="xs"
					icon={<ArrowUpIcon />}
					variant="ghost"
					color="orange.400"
				/>
			) : (
				<IconButton
					onClick={handleUpvote}
					size="xs"
					icon={<ArrowUpIcon />}
					variant="ghost"
					_hover={{ color: "orange.400" }}
				/>
			)}
			<Text
				color={
					comment.likes.includes(user._id)
						? "orange.400"
						: comment.dislikes.includes(user._id)
						? "blue.600"
						: ""
				}
			>
				{comment.likes.length - comment.dislikes.length}
			</Text>
			{comment.dislikes.includes(user._id) ? (
				<IconButton
					onClick={handleDownvote}
					size="xs"
					icon={<ArrowDownIcon />}
					variant="ghost"
					color="blue.600"
				/>
			) : (
				<IconButton
					onClick={handleDownvote}
					size="xs"
					icon={<ArrowDownIcon />}
					variant="ghost"
					_hover={{ color: "blue.600" }}
				/>
			)}
		</HStack>
	);
};

export default CommentVoting;
