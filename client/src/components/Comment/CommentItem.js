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
import { Link } from "react-router-dom";
import moment from "moment";
import { UserContext } from "../../context/UserState";
import DeleteCommentModerator from "./DeleteCommentModerator";

const CommentItem = ({ comment }) => {
	const { user } = useContext(UserContext);
	const [hideComments, setHideComments] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openReply, setOpenReply] = useState(false);
	const color = useColorModeValue("gray.300", "gray.600");
	const colorHover = useColorModeValue("gray.500", "gray.300");

	return (
		<>
			<Box mt="5">
				<VStack align="left">
					<Text fontSize="xs">
						{comment.authorId ? (
							<Link to={`/user/${comment.authorId}`}>{comment.author}</Link>
						) : (
							comment.author
						)}
						{" | "}
						{moment(comment.date).fromNow()}
						{comment.lastEditDate && (
							<>
								{" | "}
								<i>edited {moment(comment.lastEditDate).fromNow()}</i>
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
							<Text>{comment.content}</Text>
							<HStack>
								{user !== undefined && comment.authorId ? (
									<>
										<CommentVoting comment={comment} />
										<Button
											size="xs"
											onClick={() => setOpenReply(!openReply)}
											variant="ghost"
										>
											Reply
										</Button>
										{user._id === comment.authorId && (
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
										{user._id !== comment.authorId &&
											user.topicsModerating.includes(comment.topic) && (
												<DeleteCommentModerator comment={comment} />
											)}
									</>
								) : null}
							</HStack>
						</>
					)}
				</VStack>
			</Box>
			{openReply && (
				<Flex>
					<Box width="10px" borderLeft="2px" borderLeftColor={color}></Box>
					<div style={{ marginLeft: "2rem", width: "100%" }}>
						<AddReply
							comment={comment}
							openReply={openReply}
							setOpenReply={setOpenReply}
						/>
					</div>
				</Flex>
			)}
			{!hideComments ? (
				<Flex>
					<Box
						width="10px"
						borderLeft="2px"
						borderLeftColor={color}
						cursor="pointer"
						_hover={{ borderLeftColor: colorHover }}
						onClick={() => setHideComments(true)}
					></Box>
					<div style={{ marginLeft: "2rem", width: "100%" }}>
						{comment.comments
							? comment.comments.map((comment) => (
									<CommentItem comment={comment} key={comment._id} />
							  ))
							: null}
					</div>
				</Flex>
			) : (
				<Button onClick={() => setHideComments(false)} size="xs" variant="link">
					Show Comments({comment.comments.length})
				</Button>
			)}
		</>
	);
};

export default CommentItem;
