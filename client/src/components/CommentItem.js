import React, { useContext, useState } from "react";
import { Box, Text, HStack, Spacer, VStack, Button } from "@chakra-ui/react";
import DeleteComment from "./DeleteComment";
import UpdateComment from "./UpdateComment";
import AddReply from "./AddReply";
import CommentVoting from "./CommentVoting";
import { Link } from "react-router-dom";
import moment from "moment";
import { GlobalContext } from "../context/GlobalState";

const CommentItem = ({ comment }) => {
	const { user } = useContext(GlobalContext);
	const [hideComments, setHideComments] = useState(false);

	return (
		<>
			<Box mt="5">
				<HStack>
					<CommentVoting comment={comment} />
					<VStack align="left">
						<Text>{comment.content}</Text>
						<Text fontSize="xs">
							Commented by
							<Link to={`/u/${comment.authorId}`}>
								{" "}
								{comment.author}{" "}
							</Link> | {moment(comment.date).fromNow()}
						</Text>
					</VStack>
					<Spacer />
					{user !== undefined ? (
						<>
							<AddReply comment={comment} />
							{user._id === comment.authorId && (
								<>
									<DeleteComment comment={comment} />
									<UpdateComment comment={comment} />
								</>
							)}
						</>
					) : null}
				</HStack>
			</Box>
			{!hideComments ? (
				<div style={{ display: "flex", flexDirection: "row" }}>
					<div className="thread" onClick={() => setHideComments(true)}></div>
					<div style={{ marginLeft: "2.5rem", width: "100%" }}>
						{comment.comments
							? comment.comments.map((comment) => (
									<CommentItem comment={comment} key={comment._id} />
							  ))
							: null}
					</div>
				</div>
			) : (
				<Button onClick={() => setHideComments(false)} size="xs" variant="link">
					Show Comments({comment.comments.length})
				</Button>
			)}
		</>
	);
};

export default CommentItem;
