import React, { useContext } from "react";
import CommentItem from "./CommentItem";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { UserContext } from "../../context/UserState";
import { Box, Button, Divider, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useAddComment from "../../hooks/comment-query/useAddComment";

const schema = yup.object({
	content: yup.string().required(),
});

const CommentCard = ({ post }) => {
	const { user } = useContext(UserContext);
	const { comments } = post;
	const { isLoading, mutate } = useAddComment(post);

	const handleSubmit = (values, { resetForm }) => {
		const { content } = values;
		const newComment = {
			content,
			postId: post._id,
		};
		mutate({
			newComment,
		});
		resetForm();
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
							Comment as <Link to={`/user/${user._id}`}>{user.username}</Link>
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
