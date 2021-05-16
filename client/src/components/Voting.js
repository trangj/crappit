import React, { useContext } from "react";
import { IconButton } from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { UserContext } from "../context/UserState";
import { VStack } from "@chakra-ui/layout";
import { useMutation } from "react-query";
import { voting } from "../query/post-query";

const Voting = ({ post }) => {
	const { user } = useContext(UserContext);
	const voteMutation = useMutation(voting, {
		onSuccess: (res) => {
			post.likes = res.post.likes;
			post.dislikes = res.post.dislikes;
		},
	});

	const handleUpvote = () => {
		voteMutation.mutate({ topic: post.topic, id: post._id, vote: "like" });
	};

	const handleDownvote = () => {
		voteMutation.mutate({ topic: post.topic, id: post._id, vote: "dislike" });
	};

	return user ? (
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
