import React, { useContext, useState } from "react";
import { Box, Text, HStack, VStack, Button, Flex } from "@chakra-ui/react";
import DeleteComment from "./DeleteComment";
import UpdateComment from "./UpdateComment";
import AddReply from "./AddReply";
import CommentVoting from "./CommentVoting";
import { Link } from "react-router-dom";
import moment from "moment";
import { UserContext } from "../../context/UserState";

const CommentItem = ({ comment }) => {
	const { user } = useContext(UserContext);
	const [hideComments, setHideComments] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [openReply, setOpenReply] = useState(false);

	return (
		<>
			<Box mt="5">
				<VStack align="left">
					<Text fontSize="xs">
						{comment.authorId ? (
							<Link to={`/u/${comment.authorId}`}>{comment.author}</Link>
						) : (
							comment.author
						)}
						{" | "}
						{moment(comment.date).fromNow()}
						{comment.lastEditDate && (
							<i> | edited {moment(comment.date).fromNow()}</i>
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
									</>
								) : null}
							</HStack>
						</>
					)}
				</VStack>
			</Box>
			{openReply && (
				<Flex>
					<Box width="10px" borderLeft="2px" borderLeftColor="orange.300"></Box>
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
						borderLeftColor="orange.300"
						cursor="pointer"
						_hover={{ borderLeftColor: "orange.400" }}
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
