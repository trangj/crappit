import React from "react";
import { IconButton, Text, useColorModeValue } from "@chakra-ui/react";
import { TriangleUpIcon, TriangleDownIcon } from "@chakra-ui/icons";
import { useUser } from "../../context/UserState";
import { VStack } from "@chakra-ui/layout";
import Link from "next/link";
import useVoting from "../../hooks/post-query/useVoting";
import { Post } from "src/types/entities/post";

type Props = {
	post: Post;
};

const Voting = ({ post }: Props) => {
	const { user } = useUser();
	const { mutate } = useVoting(post);
	const bg = useColorModeValue(`gray.100`, `whiteAlpha.200`);

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
				<Link passHref href="/login">
					<IconButton
						as="a"
						aria-label="Downvote"
						size="xs"
						icon={<TriangleUpIcon />}
						variant="ghost"
						_hover={{ color: "orange.400", backgroundColor: bg }}
					/>
				</Link>
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
				<Link passHref href="/login">
					<IconButton
						as="a"
						aria-label="Downvote"
						size="xs"
						icon={<TriangleDownIcon />}
						variant="ghost"
						_hover={{ color: "blue.600", backgroundColor: bg }}
					/>
				</Link>
			)}
		</VStack>
	);
};

export default Voting;
