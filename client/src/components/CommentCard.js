import React, { useContext } from "react";
import CommentItem from "./CommentItem";
import * as yup from "yup";
import TextFieldForm from "./Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { UserContext } from "../context/UserState";
import { Box, Button, Divider, Text } from "@chakra-ui/react";
import { useMutation } from "react-query";
import { addComment } from "../query/comment-query";
import { Link } from "react-router-dom";
import AlertStatus from "./Utils/AlertStatus";

const schema = yup.object({
	content: yup.string().required(),
});

const CommentCard = ({ post }) => {
	const { user } = useContext(UserContext);
	const { comments } = post;
	const { isError, isLoading, error, mutate } = useMutation(addComment, {
		onSuccess: (res) => {
			post.comments = [...post.comments, res.comment];
		},
	});

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
				<Text>
					Comment as <Link to={`/u/${user._id}`}>{user.username}</Link>
				</Text>
				{user ? (
					<Formik
						initialValues={{ content: "" }}
						onSubmit={handleSubmit}
						validationSchema={schema}
					>
						{() => (
							<Form>
								<Field name="content" multiline component={TextFieldForm} />
								<Button type="submit" isLoading={isLoading}>
									Comment
								</Button>
								{isError && <AlertStatus status={error} />}
							</Form>
						)}
					</Formik>
				) : (
					<Text mt="3">Register and Login to comment!</Text>
				)}
				<Divider mt="5" />
				{comments.length === 0 ? (
					<Text my="5" color="gray.500">
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
