import React, { useState } from "react";
import DeletePostModerator from "./DeletePostModerator";
import DeletePost from "./DeletePost";
import UpdatePost from "./UpdatePost";
import Voting from "./Voting";
import { Card } from "../../ui";
import Link from "next/link";
import Image from 'next/image';
import { useUser } from "../../context/UserState";
import dayjs from "dayjs";
import { Post } from "src/types/entities/post";
import { Topic } from "src/types/entities/topic";
import { Button } from "src/ui";

type Props = {
	post: Post,
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
			<div className="w-full px-2 pt-2">
				<small>
					<Link passHref href={`/t/${post.topic}`}>
						<a className="font-medium">
							t/{post.topic}
						</a>
					</Link>
					<div className="text-gray-400 dark:text-gray-400 inline">
						{" "}&bull; Posted by{" "}
						<Link href={`/user/${post.author_id}`} passHref><a>u/{post.author}</a></Link>{" "}
						{dayjs(post.created_at).fromNow()}
					</div>
				</small>
				<h6 className="font-medium">
					{post.type === "link" ? (
						<a href={post.content} target="_blank" rel="noopener noreferrer">
							{post.title}
						</a>
					) : (
						post.title
					)}
				</h6>
				{openEdit ? (
					<UpdatePost
						post={post}
						openEdit={openEdit}
						setOpenEdit={setOpenEdit}
					/>
				) : (
					<>
						{post.type === "text" && <p>{post.content}</p>}
						{post.type === "photo" && (
							<Image
								alt={post.image_name}
								src={post.image_url}
								height="400px"
								width="400px"
							/>
						)}
						<div className="flex gap-2">
							<div className="p-2 font-medium text-gray-400 text-xs">
								{post.number_of_comments}
								{post.number_of_comments === 1 ? " Comment" : " Comments"}
							</div>
							{user && user.id === post.author_id && (
								<>
									<DeletePost post={post} />
									{post.type === "text" && (
										<Button
											onClick={() => setOpenEdit(!openEdit)}
											variant="ghost" border="rounded" className="text-xs"
										>
											Edit
										</Button>
									)}
								</>
							)}
							{user &&
								user.id !== post.author_id &&
								topic.user_moderator_id && (
									<DeletePostModerator post={post} />
								)}
						</div>
					</>
				)}
			</div>
		</Card>
	);
};

export default PostCard;
