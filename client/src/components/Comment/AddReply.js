import React from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Button } from "@chakra-ui/react";
import useAddReply from "../../hooks/comment-query/useAddReply";

const schema = yup.object({
	content: yup.string().required(""),
});

const AddReply = ({ comment, openReply, setOpenReply }) => {
	const { isLoading, mutate } = useAddReply(setOpenReply, comment);

	const handleSubmit = ({ content }) => {
		const reply = {
			content,
			postId: comment.post_id,
		};
		mutate({
			commentId: comment.id,
			reply,
		});
	};

	return (
		openReply && (
			<Formik
				initialValues={{ content: "" }}
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
							Reply
						</Button>
						<Button size="sm" onClick={() => setOpenReply(false)}>
							Cancel
						</Button>
					</Form>
				)}
			</Formik>
		)
	);
};

export default AddReply;
