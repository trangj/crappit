import React, { useContext } from "react";
import { IconButton, Text, useColorModeValue } from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { UserContext } from "../../context/UserState";
import { VStack } from "@chakra-ui/layout";
import useVoting from "../../hooks/post-query/useVoting";

const Voting = ({ post }) => {
	const { user } = useContext(UserContext);
	const { mutate } = useVoting(post);
	const bg = useColorModeValue(`gray.100`, `whiteAlpha.200`);

	const handleUpvote = () => {
		mutate({ id: post._id, vote: "like" });
	};

	const handleDownvote = () => {
		mutate({ id: post._id, vote: "dislike" });
	};

	return user ? (
		<VStack mr="3" style={{ zIndex: "10" }}>
			{post.likes.includes(user._id) ? (
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
					post.likes.includes(user._id)
						? "orange.400"
						: post.dislikes.includes(user._id)
						? "blue.600"
						: ""
				}
			>
				{post.likes.length - post.dislikes.length}
			</Text>
			{post.dislikes.includes(user._id) ? (
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
		</VStack>
	) : null;
};

export default Voting;
