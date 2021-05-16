import React from "react";
import * as yup from "yup";
import TextFieldForm from "./Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { Button } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";
import { updateComment } from "../query/comment-query";
import AlertStatus from "./Utils/AlertStatus";

const schema = yup.object({
	content: yup.string().required(),
});

const UpdateComment = ({ comment, openEdit, setOpenEdit }) => {
	const queryClient = useQueryClient();
	const { isLoading, isError, error, mutate } = useMutation(updateComment, {
		onSuccess: (res) => {
			queryClient.invalidateQueries(["post", res.comment.post]);
			setOpenEdit(false);
		},
	});

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
