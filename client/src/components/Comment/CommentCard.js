import React, { useContext } from "react";
import CommentItem from "./CommentItem";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { UserContext } from "../../context/UserState";
import { Button, Divider, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useAddComment from "../../hooks/comment-query/useAddComment";
import Card from "../Utils/Card";

const schema = yup.object({
	content: yup.string().required(""),
});

const CommentCard = ({ post, topic }) => {
	const { user } = useContext(UserContext);
	const { comments } = post;
	const { isLoading, mutate } = useAddComment(post);

	const handleSubmit = (values, { resetForm }) => {
		const { content } = values;
		const newComment = {
			content,
			postId: post.id,
		};
		mutate({
			newComment,
		});
		resetForm();
	};

	return (
		<Card id="comments">
			{user ? (
				<>
					<Text>
						Comment as <Link to={`/user/${user.id}`}>{user.username}</Link>
					</Text>
					<Formik
						initialValues={{ content: "" }}
						onSubmit={handleSubmit}
						validationSchema={schema}
					>
						{({ values }) => (
							<Form>
								<Field
									name="content"
									multiline
									component={TextFieldForm}
									placeholder="What are your thoughts?"
								/>
								<Button
									type="submit"
									isLoading={isLoading}
									isDisabled={!!!values.content}
								>
									Comment
								</Button>
							</Form>
						)}
					</Formik>
				</>
			) : (
				<Text>Log in or sign up to leave a comment</Text>
			)}
			<Divider pt="3" />
			{comments.length === 0 ? (
				<Text py="3" color="gray.500">
					It's a bit empty in here...
				</Text>
			) : (
				comments.map((comment) => (
					<CommentItem comment={comment} key={comment.id} topic={topic} />
				))
			)}
		</Card>
	);
};

export default CommentCard;
