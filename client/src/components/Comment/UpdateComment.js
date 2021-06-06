import React from "react";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { Button } from "@chakra-ui/react";
import useUpdateComment from "../../hooks/comment-query/useUpdateComment";

const schema = yup.object({
	content: yup.string().required(""),
});

const UpdateComment = ({ comment, openEdit, setOpenEdit }) => {
	const { isLoading, mutate } = useUpdateComment(setOpenEdit, comment);

	const handleSubmit = ({ content }) => {
		const newComment = {
			content,
		};
		mutate({
			commentId: comment.id,
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
				{({ values }) => (
					<Form>
						<Field name="content" multiline component={TextFieldForm} />
						<Button
							type="submit"
							mr="2"
							size="sm"
							isLoading={isLoading}
							isDisabled={!!!values.content}
						>
							Update
						</Button>
						<Button size="sm" onClick={() => setOpenEdit(false)}>
							Cancel
						</Button>
					</Form>
				)}
			</Formik>
		)
	);
};

export default UpdateComment;
