import React from "react";
import CommentItem from "./CommentItem";
import * as yup from "yup";
import TextFieldForm from "../forms/TextFieldForm";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { useUser } from "../../context/UserState";
import { Button, Divider, Text } from "@chakra-ui/react";
import Link from "next/link";
import useAddComment from "../../hooks/comment-query/useAddComment";
import Card from "../utils/Card";
import { Post } from "src/types/entities/post";
import { Topic } from "src/types/entities/topic";

const schema = yup.object({
	content: yup.string().required(""),
});

type Props = {
	post: Post,
	topic: Topic;
};

interface FormValues {
	content: string;
};

const CommentCard = ({ post, topic }: Props) => {
	const { user } = useUser();
	const { comments } = post;
	const { isLoading, mutate } = useAddComment(post);

	const handleSubmit = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
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
						Comment as <Link href={`/user/${user.id}`}>{user.username}</Link>
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
									mt="2"
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
					It&apos;s a bit empty in here...
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
