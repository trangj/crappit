import React, { useState } from "react";
import UpdateComment from "./UpdateComment";
import AddReply from "./AddReply";
import CommentVoting from "./CommentVoting";
import Link from "next/link";
import dayjs from "dayjs";
import { Comment } from "src/types/entities/comment";
import { Topic } from "src/types/entities/topic";
import { Avatar } from "../../ui/Avatar";
import { Button } from "../../ui/Button";
import { ArrowsExpandIcon } from "@heroicons/react/outline";
import Image from "next/image";
import CommentToolBar from "./CommentToolBar";

type Props = {
	comment: Comment;
	topic: Topic;
};

const CommentItem = ({ comment, topic }: Props) => {
	const [hideComments, setHideComments] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openReply, setOpenReply] = useState(false);

	if (hideComments) {
		return (
			<div className="mt-4 pt-0.5 flex gap-3 items-center">
				<Button
					aria-label="Expand comments"
					icon={
						<ArrowsExpandIcon className="h-4 w-4 dark:text-blue-400 text-blue-600" />
					}
					onClick={() => setHideComments(false)}
					border="rounded"
					variant="ghost"
					size="sm"
				/>
				<small>
					{comment.is_deleted ? (
						"[deleted]"
					) : (
						<Link href={`/user/${comment.author_id}`} passHref>
							<a className="font-medium">{comment.author}</a>
						</Link>
					)}
					<div className="text-gray-400 dark:text-gray-400 inline">
						{" "}
						&bull; {dayjs(comment.created_at).fromNow()}
					</div>
				</small>
			</div>
		);
	}

	return (
		<div className="flex mt-4">
			<div className="flex flex-col">
				{comment.is_deleted ? (
					<div>
						<Avatar className="h-7 w-7 mb-2" />
					</div>
				) : (
					<Link passHref href={`/user/${comment.author_id}`}>
						<a className="h-7 w-7 mb-2">
							{!comment.avatar_image_name ? (
								<Avatar />
							) : (
								<Image
									alt="user avatar"
									src={comment.avatar_image_name}
									width={28}
									height={28}
									className="rounded-full"
								/>
							)}
						</a>
					</Link>
				)}
				<div
					className="self-center w-3.5 cursor-pointer border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-300 h-full"
					onClick={() => setHideComments(true)}
				>
					<div
						className="border-r-2 w-2 h-full"
						style={{ borderRightColor: "inherit" }}
					></div>
				</div>
			</div>
			<div className="flex flex-col w-full">
				<div className="ml-2">
					<small>
						{comment.is_deleted ? (
							"[deleted]"
						) : (
							<Link href={`/user/${comment.author_id}`} passHref>
								<a className="font-medium">{comment.author}</a>
							</Link>
						)}
						<div className="text-gray-500 dark:text-gray-400 inline">
							{" "}
							&bull; {dayjs(comment.created_at).fromNow()}
							{comment.is_edited && (
								<i> &bull; edited {dayjs(comment.updated_at).fromNow()}</i>
							)}
						</div>
					</small>
					{openEdit ? (
						<UpdateComment
							comment={comment}
							openEdit={openEdit}
							setOpenEdit={setOpenEdit}
						/>
					) : (
						<>
							{
								<div
									className="content my-1"
									dangerouslySetInnerHTML={{
										__html: comment.is_deleted
											? "<div>[deleted]</div>"
											: comment.content,
									}}
								></div>
							}
							{!comment.is_deleted && (
								<div className="flex gap-1 mt-1">
									<CommentVoting comment={comment} />
									<CommentToolBar
										setOpenEdit={setOpenEdit}
										setOpenReply={setOpenReply}
										openEdit={openEdit}
										openReply={openReply}
										comment={comment}
										topic={topic}
									/>
								</div>
							)}
						</>
					)}
				</div>
				{openReply && (
					<div className="flex -ml-1.5">
						<div className="w-8">
							<div className="border-r-2 w-3.5 border-gray-200 dark:border-gray-700 h-full"></div>
						</div>
						<div className="ml-2 w-full">
							<AddReply
								comment={comment}
								openReply={openReply}
								setOpenReply={setOpenReply}
							/>
						</div>
					</div>
				)}
				<div className="w-full -ml-1.5">
					{comment.children &&
						comment.children.map((comment) => (
							<CommentItem comment={comment} topic={topic} key={comment.id} />
						))}
				</div>
			</div>
		</div>
	);
};

export default CommentItem;
