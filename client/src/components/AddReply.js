import React from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "./Forms/TextFieldForm";
import { Button } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";
import { addReply } from "../query/comment-query";

const schema = yup.object({
	content: yup.string().required(),
});

const AddReply = ({ comment, openReply, setOpenReply }) => {
	const queryClient = useQueryClient();
	const addReplyMutation = useMutation(addReply, {
		onSuccess: (res) => {
			queryClient.invalidateQueries(["post", res.reply.post]);
			setOpenReply(false);
		},
	});

	const handleSubmit = (values) => {
		const { content } = values;
		const reply = {
			content,
		};
		addReplyMutation.mutate({
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
						<Button type="submit" mr="2" size="sm">
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
