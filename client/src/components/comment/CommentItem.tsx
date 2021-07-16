import React, { useState } from "react";
import DeleteComment from "./DeleteComment";
import UpdateComment from "./UpdateComment";
import AddReply from "./AddReply";
import CommentVoting from "./CommentVoting";
import Link from "next/link";
import { useUser } from "../../context/UserState";
import DeleteCommentModerator from "./DeleteCommentModerator";
import dayjs from "dayjs";
import { Comment } from "src/types/entities/comment";
import { Topic } from "src/types/entities/topic";
import { Button } from '../../ui';
import { ArrowsExpandIcon, ChatAltIcon } from "@heroicons/react/outline";
import { Avatar } from "src/ui";

type Props = {
	comment: Comment,
	topic: Topic;
};

const CommentItem = ({ comment, topic }: Props) => {
	const { user } = useUser();
	const [hideComments, setHideComments] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openReply, setOpenReply] = useState(false);

	return !hideComments ? (
		<div className="flex mt-4">
			<div className="flex flex-col">
				<Link passHref href={`/user/${comment.author_id}`}>
					<a>
						<Avatar className="h-7 w-7 mb-2" />
					</a>
				</Link>
				<div
					className="self-center w-3.5 cursor-pointer border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-300 h-full"
					onClick={() => setHideComments(true)}
				>
					<div className="border-r-2 w-2 h-full" style={{ borderRightColor: 'inherit' }}></div>
				</div>
			</div>
			<div className="flex flex-col w-full">
				<div className="ml-2">
					<small>
						{comment.is_deleted ? (
							"[deleted]"
						) : (
							<Link href={`/user/${comment.author_id}`} passHref><a className="font-medium">{comment.author}</a></Link>
						)}
						<div className="text-gray-500 dark:text-gray-400 inline">
							{" "}&bull;{" "}
							{dayjs(comment.created_at).fromNow()}
							{comment.is_edited && (
								<>
									{" "}&bull;{" "}
									<i>edited {dayjs(comment.updated_at).fromNow()}</i>
								</>
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
							<p>{comment.is_deleted ? "[deleted]" : comment.content}</p>
							{comment.content ? (
								<div className="flex gap-2 mt-1">
									<CommentVoting comment={comment} />
									{user ? (
										<>
											<Button
												onClick={() => setOpenReply(!openReply)}
												variant="ghost"
												border="rounded"
												className="text-xs"
											>
												<ChatAltIcon className="h-5 w-5 mr-1" />
												Reply
											</Button>
											{user.id === comment.author_id && (
												<>
													<DeleteComment comment={comment} />
													<Button
														onClick={() => setOpenEdit(!openEdit)}
														variant="ghost"
														border="rounded"
														className="text-xs"
													>
														Edit
													</Button>
												</>
											)}
											{topic &&
												user.id !== comment.author_id &&
												topic.user_moderator_id && (
													<DeleteCommentModerator comment={comment} />
												)}
										</>
									) : (
										<Link passHref href="/login">
											<Button
												variant="ghost"
												border="rounded"
												className="text-xs"
												as="a"
											>
												<ChatAltIcon className="h-5 w-5 mr-1" />
												Reply
											</Button>
										</Link>
									)}
								</div>
							) : null}
						</>
					)}
				</div>
				{openReply && (
					<div className="flex">
						<div className="w-8">
							<div className="border-r-2 w-3.5 border-gray-300 dark:border-gray-600 h-full"></div>
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
				<div className="w-full">
					{comment.children
						? comment.children.map((comment) => (
							<CommentItem
								comment={comment}
								topic={topic}
								key={comment.id}
							/>
						))
						: null}
				</div>
			</div>
		</div>
	) : (
		<div className="mt-4 flex gap-3">
			<Button aria-label="Expand comments" icon={<ArrowsExpandIcon className="h-4 w-4 dark:text-blue-400 text-blue-600" />} onClick={() => setHideComments(false)} border="rounded" variant="ghost" />
			<small className="self-center">
				{comment.is_deleted ? '[deleted]' :
					<Link href={`/user/${comment.author_id}`} passHref>
						<a className="font-medium">
							{comment.author}
						</a>
					</Link>
				}
				<div className="text-gray-400 dark:text-gray-400 inline">
					{" "}&bull;{" "}{dayjs(comment.created_at).fromNow()}
				</div>
			</small>
		</div>
	);
};

export default CommentItem;
