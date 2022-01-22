import React from "react";
import Voting from "./Voting";
import Link from "next/link";
import { LinkCard, LinkCardOverlay } from "../../ui/LinkCard";
import { Button } from "../../ui/Button";
import dayjs from "dayjs";
import { Post } from "src/types/entities/post";
import { ChatAltIcon, ReplyIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";

type Props = {
	post: Post;
};

const PostItem = ({ post, ...props }: Props) => {
	return (
		<LinkCard {...props} className="flex">
			<div className="pb-auto p-1 dark:bg-gray-900 bg-gray-50 hidden sm:flex">
				<Voting post={post} />
			</div>
			<div className="flex flex-col w-full">
				<div className="w-full p-2 pb-0">
					<small className="flex pb-1">
						<Link passHref href={`/t/${post.topic}`}>
							<a className="font-bold">t/{post.topic}</a>
						</Link>{" "}
						<div className="text-gray-500 dark:text-gray-400 ml-1">
							&bull; Posted by{" "}
							<Link passHref href={`/user/${post.author_id}`}>
								<a>u/{post.author}</a>
							</Link>{" "}
							{dayjs(post.created_at).fromNow()}
						</div>
					</small>
					<h6 className="font-medium">
						<Link passHref href={`/t/${post.topic}/comments/${post.id}`}>
							<LinkCardOverlay>{post.title}</LinkCardOverlay>
						</Link>
					</h6>
					{post.type === "text" && post.content && (
						<div
							style={{
								maxHeight: 250,
								overflow: "hidden",
								WebkitMaskImage: "linear-gradient(180deg,#000 60%,transparent)",
								maskImage: "linear-gradient(180deg,#000 60%,transparent)",
							}}
							className="pb-2 pt-1 content"
							dangerouslySetInnerHTML={{ __html: post.content }}
						></div>
					)}
					{post.type === "link" && (
						<a
							href={post.content}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 dark:text-blue-400 hover:underline text-xs"
						>
							{post.content}
						</a>
					)}
				</div>
				{post.type === "photo" && (
					<Link passHref href={`/t/${post.topic}/comments/${post.id}`}>
						<a className="self-center mt-2">
							<img
								src={`https://crappit.imgix.net/${post.image_name}?auto=format&w=1920`}
								alt="post media"
								style={{ maxHeight: 512 }}
							/>
						</a>
					</Link>
				)}
				<div className="flex px-2">
					<div className="flex items-center sm:hidden">
						<Voting post={post} orientation="horizontal" />
					</div>
					<Link passHref href={`/t/${post.topic}/comments/${post.id}#comments`}>
						<Button
							variant="ghost"
							border="rounded"
							className="text-xs"
							size="lg"
							as="a"
							icon={<ChatAltIcon className="h-5 w-5 mr-1" />}
						>
							{post.number_of_comments}
							{post.number_of_comments === 1 ? " Comment" : " Comments"}
						</Button>
					</Link>
					<Button
						variant="ghost"
						border="rounded"
						className="text-xs"
						size="lg"
						icon={<ReplyIcon className="h-5 w-5 mr-1" />}
						onClick={() => {
							navigator.clipboard.writeText(
								`https://${process.env.NEXT_PUBLIC_DOMAIN_NAME}/t/${post.topic}/comments/${post.id}`
							);
							toast.success("Copied link!");
						}}
					>
						Share
					</Button>
				</div>
			</div>
		</LinkCard>
	);
};

export default PostItem;
