import React, { useContext } from "react";
import { IconButton, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { UserContext } from "../../context/UserState";
import { Link, useLocation } from "react-router-dom";
import useCommentVoting from "../../hooks/comment-query/useCommentVoting";

const CommentVoting = ({ comment }) => {
	const { user } = useContext(UserContext);
	const { mutate } = useCommentVoting(comment);
	const bg = useColorModeValue(`gray.100`, `whiteAlpha.200`);
	const location = useLocation();

	const handleUpvote = () => {
		mutate({
			commentId: comment.id,
			vote: "like",
		});
	};

	const handleDownvote = () => {
		mutate({
			commentId: comment.id,
			vote: "dislike",
		});
	};

	return user ? (
		<HStack>
			{comment.user_vote === 1 ? (
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
					_hover={{ color: "orange.400", backgroundColor: bg }}
				/>
			)}
			<Text
				color={
					comment.user_vote === 1
						? "orange.400"
						: comment.user_vote === -1
						? "blue.600"
						: ""
				}
			>
				{comment.vote}
			</Text>
			{comment.user_vote === -1 ? (
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
					_hover={{ color: "blue.600", backgroundColor: bg }}
				/>
			)}
		</HStack>
	) : (
		<HStack>
			<IconButton
				as={Link}
				to={{
					pathname: "/login",
					state: {
						status: {
							text: "Login to vote on comments",
							severity: "error",
						},
						from: location.pathname,
					},
				}}
				size="xs"
				icon={<ArrowUpIcon />}
				variant="ghost"
				_hover={{ color: "orange.400", backgroundColor: bg }}
			/>
			<Text>{comment.vote}</Text>
			<IconButton
				as={Link}
				to={{
					pathname: "/login",
					state: {
						status: {
							text: "Login to vote on comments",
							severity: "error",
						},
						from: location.pathname,
					},
				}}
				size="xs"
				icon={<ArrowDownIcon />}
				variant="ghost"
				_hover={{ color: "blue.600", backgroundColor: bg }}
			/>
		</HStack>
	);
};

export default CommentVoting;
