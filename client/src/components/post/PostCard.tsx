import React, { useState } from "react";
import DeletePostModerator from "./DeletePostModerator";
import DeletePost from "./DeletePost";
import UpdatePost from "./UpdatePost";
import Voting from "./Voting";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import Link from "next/link";
import { useUser } from "../../context/UserState";
import dayjs from "dayjs";
import { Post } from "src/types/entities/post";
import { Topic } from "src/types/entities/topic";
import { ChatAltIcon, PencilIcon, ReplyIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";

type Props = {
	post: Post;
	topic: Topic;
};

const PostCard = ({ post, topic }: Props) => {
	const { user } = useUser();
	const [openEdit, setOpenEdit] = useState(false);

	return (
		<Card className="flex">
			<div className="pb-auto p-2">
				<Voting post={post} />
			</div>
			<div className="flex flex-col w-full">
				<div className="w-full p-2">
					<small>
						<Link passHref href={`/t/${post.topic}`}>
							<a className="font-bold">t/{post.topic}</a>
						</Link>
						<div className="text-gray-500 dark:text-gray-400 inline">
							{" "}
							&bull; Posted by{" "}
							<Link href={`/user/${post.author_id}`} passHref>
								<a>u/{post.author}</a>
							</Link>{" "}
							{dayjs(post.created_at).fromNow()}
						</div>
					</small>
					<h6 className="font-medium">{post.title}</h6>
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
					{openEdit ? (
						<UpdatePost
							post={post}
							openEdit={openEdit}
							setOpenEdit={setOpenEdit}
						/>
					) : (
						post.type === "text" && (
							<div
								className="py-2 content"
								dangerouslySetInnerHTML={{ __html: post.content }}
							></div>
						)
					)}
				</div>
				{post.type === "photo" && (
					<a
						href={`https://crappit.imgix.net/${post.image_name}`}
						className="self-center"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							src={`https://crappit.imgix.net/${post.image_name}?auto=format&w=1920`}
							alt="post media"
							style={{ maxHeight: 700 }}
						/>
					</a>
				)}
				<div className="flex flex-wrap gap-x-1">
					<div className="p-2 font-medium text-gray-500 dark:text-gray-400 text-xs flex items-center">
						<ChatAltIcon className="h-5 w-5 mr-1 inline" />
						{post.number_of_comments}
						{post.number_of_comments === 1 ? " Comment" : " Comments"}
					</div>
					<Button
						size="lg"
						variant="ghost"
						border="rounded"
						className="text-xs"
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
					{user && user.id === post.author_id && (
						<>
							<DeletePost post={post} />
							{post.type === "text" && (
								<Button
									onClick={() => setOpenEdit(!openEdit)}
									size="lg"
									variant="ghost"
									border="rounded"
									className="text-xs"
									icon={<PencilIcon className="h-5 w-5 mr-1" />}
								>
									Edit
								</Button>
							)}
						</>
					)}
					{user && topic.user_moderator_id && (
						<DeletePostModerator post={post} />
					)}
				</div>
			</div>
		</Card>
	);
};

export default PostCard;
