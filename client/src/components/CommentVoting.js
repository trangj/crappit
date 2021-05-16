import React, { useContext } from "react";
import { IconButton, HStack } from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { UserContext } from "../context/UserState";
import { useMutation } from "react-query";
import { commentVoting } from "../query/comment-query";

const CommentVoting = ({ comment }) => {
	const { user } = useContext(UserContext);
	const { mutate } = useMutation(commentVoting, {
		onSuccess: (res) => {
			comment.likes = res.comment.likes;
			comment.dislikes = res.comment.dislikes;
		},
	});

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
