import React, { useContext } from "react";
import { IconButton, Text, useColorModeValue } from "@chakra-ui/react";
import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import { UserContext } from "../../context/UserState";
import { VStack } from "@chakra-ui/layout";
import { Link, useLocation } from "react-router-dom";
import useVoting from "../../hooks/post-query/useVoting";
import { Post } from "src/types/entities/post";

type Props = {
	post: Post;
};

const Voting = ({ post }: Props) => {
	const { user } = useContext(UserContext);
	const { mutate } = useVoting(post);
	const bg = useColorModeValue(`gray.100`, `whiteAlpha.200`);
	const location = useLocation();

	const handleUpvote = () => {
		mutate({ id: post.id, vote: "like" });
	};

	const handleDownvote = () => {
		mutate({ id: post.id, vote: "dislike" });
	};

	return (
		<VStack mr="3" spacing="0">
			{user ? (
				<IconButton
					aria-label="Upvote"
					onClick={handleUpvote}
					size="xs"
					icon={<TriangleUpIcon />}
					variant="ghost"
					color={post.user_vote === 1 ? "orange.400" : ""}
					_hover={{ color: "orange.400", backgroundColor: bg }}
				/>
			) : (
				<IconButton
					aria-label="Downvote"
					as={Link}
					to={{
						pathname: "/login",
						state: {
							status: {
								status: {
									text: "Login to vote on posts",
									severity: "error",
								}
							},
							from: location.pathname,
						},
					}}
					size="xs"
					icon={<TriangleUpIcon />}
					variant="ghost"
					_hover={{ color: "orange.400", backgroundColor: bg }}
				/>
			)}
			<Text
				color={
					user
						? post.user_vote === 1
							? "orange.400"
							: post.user_vote === -1
								? "blue.600"
								: ""
						: ""
				}
				fontWeight="500"
			>
				{post.vote}
			</Text>
			{user ? (
				<IconButton
					aria-label="Downvote"
					onClick={handleDownvote}
					size="xs"
					icon={<TriangleDownIcon />}
					variant="ghost"
					color={post.user_vote === -1 ? "blue.600" : ""}
					_hover={{ color: "blue.600", backgroundColor: bg }}
				/>
			) : (
				<IconButton
					aria-label="Downvote"
					as={Link}
					to={{
						pathname: "/login",
						state: {
							status: {
								status: {
									text: "Login to vote on posts",
									severity: "error",
								}
							},
							from: location.pathname,
						},
					}}
					size="xs"
					icon={<TriangleDownIcon />}
					variant="ghost"
					_hover={{ color: "blue.600", backgroundColor: bg }}
				/>
			)}
		</VStack>
	);
};

export default Voting;
