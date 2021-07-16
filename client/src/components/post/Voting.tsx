import React from "react";
import { useUser } from "../../context/UserState";
import Link from "next/link";
import useVoting from "../../hooks/post-query/useVoting";
import { Post } from "src/types/entities/post";
import { Button } from "src/ui";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/solid";

type Props = {
	post: Post;
};

const Voting = ({ post }: Props) => {
	const { user } = useUser();
	const { mutate } = useVoting(post);

	const handleUpvote = () => {
		mutate({ id: post.id, vote: "like" });
	};

	const handleDownvote = () => {
		mutate({ id: post.id, vote: "dislike" });
	};

	return (
		<div className="flex flex-col">
			{user ? (
				<Button
					aria-label="Upvote"
					onClick={handleUpvote}
					icon={<ArrowUpIcon className="w-5 h-5" />}
					variant="ghost"
					border="rounded"
					className={post.user_vote === 1 ? "bg-white bg-opacity-5 text-upvote" : ""}
				/>
			) : (
				<Link passHref href="/login">
					<Button
						aria-label="Upvote"
						onClick={handleUpvote}
						icon={<ArrowUpIcon className="w-5 h-5" />}
						variant="ghost"
						border="rounded"
						as="a"
					/>
				</Link>
			)}
			<p className={
				`mx-0.5 text-xs font-bold self-center ${user
					? post.user_vote === 1
						? "text-upvote"
						: post.user_vote === -1
							? "text-downvote"
							: ""
					: "text-gray-200"}`
			}
			>
				{post.vote}
			</p>
			{user ? (
				<Button
					aria-label="Upvote"
					onClick={handleDownvote}
					icon={<ArrowDownIcon className="w-5 h-5" />}
					variant="ghost"
					border="rounded"
					className={post.user_vote === -1 ? "bg-white bg-opacity-5 text-downvote" : ""}
				/>
			) : (
				<Link passHref href="/login">
					<Button
						aria-label="Upvote"
						onClick={handleDownvote}
						icon={<ArrowDownIcon className="w-5 h-5" />}
						variant="ghost"
						border="rounded"
						as="a"
					/>
				</Link>
			)}
		</div>
	);
};

export default Voting;
