import React, { useContext } from "react";
import CommentItem from "./CommentItem";
import * as yup from "yup";
import TextFieldForm from "./Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { GlobalContext } from "../context/GlobalState";
import { Heading, Box, Button, Divider, Text } from "@chakra-ui/react";

const schema = yup.object({
	content: yup.string().required(),
});

const CommentCard = () => {
	const { user, post, addComment } = useContext(GlobalContext);
	const { comments } = post;

	const handleSubmit = (values, { resetForm }) => {
		const { content } = values;
		const newComment = {
			content,
		};
		addComment(post.topic, post._id, newComment);
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
				<Heading>Comments</Heading>
				{user ? (
					<Formik
						initialValues={{ content: "" }}
						onSubmit={handleSubmit}
						validationSchema={schema}
					>
						{() => (
							<Form>
								<Field name="content" multiline component={TextFieldForm} />
								<Button type="submit">Post</Button>
							</Form>
						)}
					</Formik>
				) : (
					<Text mt="3">Register and Login to comment!</Text>
				)}
				<Divider mt="5" />
				{comments &&
					comments.map((comment) => (
						<CommentItem comment={comment} key={comment._id} />
					))}
			</Box>
		</Box>
	);
};

export default CommentCard;
