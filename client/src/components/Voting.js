import React, { useContext } from "react";
import { IconButton } from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { GlobalContext } from "../context/GlobalState";
import { VStack } from "@chakra-ui/layout";

const Voting = ({ post }) => {
	const { user, changeVote } = useContext(GlobalContext);

	const handleUpvote = () => {
		changeVote(post.topic, post._id, "like");
	};

	const handleDownvote = () => {
		changeVote(post.topic, post._id, "dislike");
	};

	return user && post.likes && post.dislikes ? (
		<VStack mr="1">
			{post.likes.includes(user._id) ? (
				<IconButton
					onClick={handleUpvote}
					size="sm"
					icon={<ArrowUpIcon color="orange.400" />}
				/>
			) : (
				<IconButton onClick={handleUpvote} size="sm" icon={<ArrowUpIcon />} />
			)}
			<div>{post.likes.length - post.dislikes.length}</div>
			{post.dislikes.includes(user._id) ? (
				<IconButton
					onClick={handleDownvote}
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

export default Voting;
