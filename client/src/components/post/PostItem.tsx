import React from "react";
import Voting from "./Voting";
import Link from "next/link";
import Image from 'next/image';
import { LinkCard, LinkCardOverlay } from "../../ui";
import dayjs from "dayjs";
import { Post } from "src/types/entities/post";
import { Button } from "src/ui";
import { ChatAltIcon, ReplyIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";

type Props = {
	post: Post;
};

const PostItem = ({ post, ...props }: Props) => {
	return (
		<LinkCard {...props} className="flex">
			<div className="pb-auto p-1 dark:bg-gray-900 bg-gray-50">
				<Voting post={post} />
			</div>
			<div className="flex flex-col w-full">
				<div className="w-full p-2">
					<small>
						<Link passHref href={`/t/${post.topic}`}>
							<a className="font-medium">
								t/{post.topic}
							</a>
						</Link>{" "}
						<div className="text-gray-500 dark:text-gray-400 inline">
							&bull; Posted by{" "}
							<Link passHref href={`/user/${post.author_id}`}>
								<a>
									u/{post.author}
								</a>
							</Link>{" "}
							{dayjs(post.created_at).fromNow()}
						</div>
					</small>
					<h6 className="font-medium">
						<Link passHref href={`/t/${post.topic}/comments/${post.id}`}>
							<LinkCardOverlay>
								{post.title}
							</LinkCardOverlay>
						</Link>
					</h6>
					{post.type === "text" && (
						<div dangerouslySetInnerHTML={{ __html: post.content }}></div>
					)}
					{post.type === "link" && (
						<a href={post.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-xs">
							{post.content}
						</a>
					)}
				</div>
				{post.type === "photo" && (
					<Link passHref href={`/t/${post.topic}/comments/${post.id}`}>
						<a>
							<div style={{ maxHeight: 512, position: 'relative' }}>
								<div style={{ paddingBottom: '100%' }} />
								<Image
									alt={post.title}
									src={post.image_name}
									layout="fill"
									objectFit="contain"
								/>
							</div>
						</a>
					</Link>
				)}
				<div className="flex px-2">
					<Link passHref href={`/t/${post.topic}/comments/${post.id}#comments`}>
						<Button variant="ghost" border="rounded" className="text-xs p-2" as="a" icon={<ChatAltIcon className="h-5 w-5 mr-1" />}>
							{post.number_of_comments}
							{post.number_of_comments === 1 ? " Comment" : " Comments"}
						</Button>
					</Link>
					<Button variant="ghost" border="rounded" className="text-xs p-2" icon={<ReplyIcon className="h-5 w-5 mr-1" />}
						onClick={() => {
							navigator.clipboard.writeText(`https://crappit.me/t/${post.topic}/comments/${post.id}`);
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
