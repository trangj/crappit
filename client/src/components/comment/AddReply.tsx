import React from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "../forms/TextFieldForm";
import { Button } from "@chakra-ui/react";
import useAddReply from "../../hooks/comment-query/useAddReply";
import { Comment } from "src/types/entities/comment";

const schema = yup.object({
	content: yup.string().required(""),
});

type Props = {
	comment: Comment,
	openReply: boolean,
	setOpenReply: (arg: boolean) => void;
};

interface FormValues {
	content: string;
};

const AddReply = ({ comment, openReply, setOpenReply }: Props) => {
	const { isLoading, mutate } = useAddReply(setOpenReply, comment);

	const handleSubmit = ({ content }: FormValues) => {
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
		openReply ? (
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
		) : null
	);
};

export default AddReply;
