import React, { useContext } from "react";
import { IconButton, Text, useColorModeValue } from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { UserContext } from "../../context/UserState";
import { VStack } from "@chakra-ui/layout";
import { Link, useLocation } from "react-router-dom";
import useVoting from "../../hooks/post-query/useVoting";

const Voting = ({ post }) => {
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

	return user ? (
		<VStack mr="3">
			{post.user_vote === 1 ? (
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
					post.user_vote === 1
						? "orange.400"
						: post.user_vote === -1
						? "blue.600"
						: ""
				}
			>
				{post.vote}
			</Text>
			{post.user_vote === -1 ? (
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
	) : (
		<VStack mr="3">
			<IconButton
				as={Link}
				to={{
					pathname: "/login",
					state: {
						status: {
							text: "Login to vote on posts",
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
			<Text>{post.vote}</Text>
			<IconButton
				as={Link}
				to={{
					pathname: "/login",
					state: {
						status: {
							text: "Login to vote on posts",
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
		</VStack>
	);
};

export default Voting;
