import React, { useContext } from "react";
import CommentItem from "./CommentItem";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { UserContext } from "../../context/UserState";
import { Box, Button, Divider, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import AlertStatus from "../Utils/AlertStatus";
import useAddComment from "../../hooks/comment-query/useAddComment";

const schema = yup.object({
	content: yup.string().required(),
});

const CommentCard = ({ post }) => {
	const { user } = useContext(UserContext);
	const { comments } = post;
	const { isError, isLoading, error, mutate } = useAddComment(post);

	const handleSubmit = (values, { resetForm }) => {
		const { content } = values;
		const newComment = {
			content,
		};
		mutate({
			topic: post.topic,
			postid: post._id,
			newComment,
		});
		resetForm("");
	};

	return (
		<Box
			mb="2"
			borderWidth="1px"
			borderRadius="lg"
			overflow="hidden"
			id="comments"
		>
			<Box m="3">
				{user ? (
					<>
						<Text>
							Comment as <Link to={`/u/${user._id}`}>{user.username}</Link>
						</Text>
						<Formik
							initialValues={{ content: "" }}
							onSubmit={handleSubmit}
							validationSchema={schema}
						>
							{() => (
								<Form>
									<Field
										name="content"
										multiline
										component={TextFieldForm}
										placeholder="What are your thoughts?"
									/>
									<Button type="submit" isLoading={isLoading}>
										Comment
									</Button>
									{isError && <AlertStatus status={error} />}
								</Form>
							)}
						</Formik>
					</>
				) : (
					<Text>Log in or sign up to leave a comment</Text>
				)}
				<Divider pt="5" />
				{comments.length === 0 ? (
					<Text py="3" color="gray.500">
						It's a bit empty in here...
					</Text>
				) : (
					comments.map((comment) => (
						<CommentItem comment={comment} key={comment._id} />
					))
				)}
			</Box>
		</Box>
	);
};

export default CommentCard;
