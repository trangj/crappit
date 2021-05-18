import React from "react";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { Button } from "@chakra-ui/react";
import useUpdateComment from "../../hooks/comment-query/useUpdateComment";
import AlertStatus from "../Utils/AlertStatus";

const schema = yup.object({
	content: yup.string().required(),
});

const UpdateComment = ({ comment, openEdit, setOpenEdit }) => {
	const { isLoading, isError, error, mutate } = useUpdateComment(
		setOpenEdit,
		comment
	);

	const handleSubmit = (values) => {
		const { content } = values;
		const newComment = {
			content,
		};
		mutate({
			topic: comment.topic,
			postid: comment.post,
			commentid: comment._id,
			newComment,
		});
	};

	return (
		openEdit && (
			<Formik
				initialValues={{ content: comment.content }}
				onSubmit={handleSubmit}
				validationSchema={schema}
			>
				{() => (
					<Form>
						<Field name="content" multiline component={TextFieldForm} />
						<Button type="submit" mr="2" size="sm" isLoading={isLoading}>
							Update
						</Button>
						<Button size="sm" onClick={() => setOpenEdit(false)}>
							Cancel
						</Button>
						{isError && <AlertStatus status={error} />}
					</Form>
				)}
			</Formik>
		)
	);
};

export default UpdateComment;
