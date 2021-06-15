import React, { useContext, useState } from "react";
import {
	Box,
	Text,
	HStack,
	VStack,
	Button,
	Flex,
	useColorModeValue,
} from "@chakra-ui/react";
import DeleteComment from "./DeleteComment";
import UpdateComment from "./UpdateComment";
import AddReply from "./AddReply";
import CommentVoting from "./CommentVoting";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserState";
import DeleteCommentModerator from "./DeleteCommentModerator";
import dayjs from "dayjs";
import { Comment } from "src/types/entities/comment";
import { Topic } from "src/types/entities/topic";

type Props = {
	comment: Comment,
	topic: Topic;
};

const CommentItem = ({ comment, topic }: Props) => {
	const { user } = useContext(UserContext);
	const [hideComments, setHideComments] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openReply, setOpenReply] = useState(false);
	const color = useColorModeValue("gray.300", "gray.600");
	const colorHover = useColorModeValue("gray.500", "gray.300");
	const location = useLocation();

	return (
		<>
			<Box mt="5">
				<VStack align="left">
					<Text fontSize="xs">
						{comment.is_deleted ? (
							"[deleted]"
						) : (
							<Link to={`/user/${comment.author_id}`}>{comment.author}</Link>
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
							<Text>{comment.is_deleted ? "[deleted]" : comment.content}</Text>
							{comment.content ? (
								<HStack>
									<CommentVoting comment={comment} />
									{user !== null ? (
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
										<Button
											size="xs"
											as={Link}
											to={{
												pathname: "/login",
												state: {
													status: {
														status: {
															text: "Login to reply to comments",
															severity: "error",
														}
													},
													from: location.pathname,
												},
											}}
											variant="ghost"
										>
											Reply
										</Button>
									)}
								</HStack>
							) : null}
						</>
					)}
				</VStack>
			</Box>
			{openReply && (
				<Flex>
					<Box width="0.8rem">
						<Box
							borderRight="2px"
							width="0.4rem"
							height="100%"
							borderRightColor={color}
						></Box>
					</Box>
					<Box marginLeft="0.8rem" width="100%">
						<AddReply
							comment={comment}
							openReply={openReply}
							setOpenReply={setOpenReply}
						/>
					</Box>
				</Flex>
			)}
			{!hideComments ? (
				<Flex>
					<Box
						width="0.8rem"
						cursor="pointer"
						onClick={() => setHideComments(true)}
						borderRightColor={color}
						_hover={{ borderRightColor: colorHover }}
					>
						<Box
							borderRight="2px"
							width="0.4rem"
							height="100%"
							borderRightColor="inherit"
						></Box>
					</Box>
					<Box marginLeft="0.8rem" width="100%">
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
			) : (
				<Button onClick={() => setHideComments(false)} size="xs" variant="link">
					Show Comments({comment.children.length})
				</Button>
			)}
		</>
	);
};

export default CommentItem;
