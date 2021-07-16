import React from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "../../ui/TextFieldForm";
import useAddReply from "../../hooks/comment-query/useAddReply";
import { Comment } from "src/types/entities/comment";
import { Button } from '../../ui';

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
						<div className="flex flex-row-reverse gap-2">
							<Button
								type="submit"
								loading={isLoading}
								disabled={!!!values.content}
								variant="filled"
								className="w-24"
							>
								Reply
							</Button>
							<Button className="w-24" onClick={() => setOpenReply(false)}>
								Cancel
							</Button>
						</div>
					</Form>
				)}
			</Formik>
		) : null
	);
};

export default AddReply;
