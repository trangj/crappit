import React, { useState } from "react";
import {
	Box,
	Text,
	HStack,
	Button,
	Flex,
	useColorModeValue,
	Avatar,
	IconButton
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
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

type Props = {
	comment: Comment,
	topic: Topic;
};

const CommentItem = ({ comment, topic }: Props) => {
	const { user } = useUser();
	const [hideComments, setHideComments] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openReply, setOpenReply] = useState(false);
	const color = useColorModeValue("gray.300", "gray.600");
	const colorHover = useColorModeValue("gray.500", "gray.300");

	return !hideComments ? (
		<Flex mt="4">
			<Flex flexDirection="column">
				<Link passHref href={`/user/${comment.author_id}`}>
					<Avatar as="a" size="xs" mb="2" />
				</Link>
				<Box
					alignSelf='center'
					width="0.8rem"
					cursor="pointer"
					onClick={() => setHideComments(true)}
					borderRightColor={color}
					_hover={{ borderRightColor: colorHover }}
					height="100%"
				>
					<Box
						borderRight="2px"
						width="7px"
						height="100%"
						borderRightColor="inherit"
					></Box>
				</Box>
			</Flex>
			<Flex align="left" width="100%" flexDirection="column">
				<Box ml="2">
					<Text fontSize="xs" mt="0.5">
						{comment.is_deleted ? (
							"[deleted]"
						) : (
							<Link href={`/user/${comment.author_id}`}>{comment.author}</Link>
						)}
						{" | "}
						{dayjs(comment.created_at).fromNow()}
						{comment.is_edited && (
							<>
								{" | "}
								<i>edited {dayjs(comment.updated_at).fromNow()}</i>
							</>
						)}
					</Text>
					{openEdit ? (
						<UpdateComment
							comment={comment}
							openEdit={openEdit}
							setOpenEdit={setOpenEdit}
						/>
					) : (
						<>
							<Text my="1">{comment.is_deleted ? "[deleted]" : comment.content}</Text>
							{comment.content ? (
								<HStack>
									<CommentVoting comment={comment} />
									{user ? (
										<>
											<Button
												size="xs"
												onClick={() => setOpenReply(!openReply)}
												variant="ghost"
											>
												Reply
											</Button>
											{user.id === comment.author_id && (
												<>
													<DeleteComment comment={comment} />
													<Button
														size="xs"
														onClick={() => setOpenEdit(!openEdit)}
														variant="ghost"
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
												size="xs"
												as="a"
												variant="ghost"
											>
												Reply
											</Button>
										</Link>
									)}
								</HStack>
							) : null}
						</>
					)}
				</Box>
				{openReply && (
					<Flex>
						<Box width="24px">
							<Box
								borderRight="2px"
								width="12px"
								height="100%"
								borderRightColor={color}
							></Box>
						</Box>
						<Box ml="3" width="100%">
							<AddReply
								comment={comment}
								openReply={openReply}
								setOpenReply={setOpenReply}
							/>
						</Box>
					</Flex>
				)}
				<Box width="100%">
					{comment.children
						? comment.children.map((comment) => (
							<CommentItem
								comment={comment}
								topic={topic}
								key={comment.id}
							/>
						))
						: null}
				</Box>
			</Flex>
		</Flex>
	) : (
		<Flex my="3">
			<IconButton aria-label="expand comments" icon={<AddIcon />} onClick={() => setHideComments(false)} size="xs" variant="ghost" />
			<Text fontSize="xs" mt="0.5" ml="1">
				{comment.is_deleted ? '[deleted]' :
					<Link href={`/user/${comment.author_id}`}>
						{comment.author}
					</Link>
				}
				{" | "}{dayjs(comment.created_at).fromNow()}
			</Text>
		</Flex>
	);
};

export default CommentItem;
