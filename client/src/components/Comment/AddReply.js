import React from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Button } from "@chakra-ui/react";
import AlertStatus from "../Utils/AlertStatus";
import useAddReply from "../../hooks/comment-query/useAddReply";

const schema = yup.object({
	content: yup.string().required(),
});

const AddReply = ({ comment, openReply, setOpenReply }) => {
	const { isError, isLoading, error, mutate } = useAddReply(
		setOpenReply,
		comment
	);

	const handleSubmit = (values) => {
		const { content } = values;
		const reply = {
			content,
		};
		mutate({
			topic: comment.topic,
			postid: comment.post,
			commentid: comment._id,
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
				{({ setFieldValue }) => (
					<Form>
						<Field name="content" multiline component={TextFieldForm} />
						<Button type="submit" mr="2" size="sm" isLoading={isLoading}>
							Reply
						</Button>
						<Button size="sm" onClick={() => setOpenReply(false)}>
							Cancel
						</Button>
						{isError && <AlertStatus status={error} />}
					</Form>
				)}
			</Formik>
		)
	);
};

export default AddReply;
