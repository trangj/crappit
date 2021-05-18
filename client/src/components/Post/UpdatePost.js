import React from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Button } from "@chakra-ui/react";
import AlertStatus from "../Utils/AlertStatus";
import useUpdatePost from "../../hooks/post-query/useUpdatePost";

const schema = yup.object({
	content: yup.string().required(),
});

const UpdatePost = ({ post, openEdit, setOpenEdit }) => {
	const { isError, isLoading, error, mutate } = useUpdatePost(
		setOpenEdit,
		post
	);

	const handleSubmit = (values) => {
		const { content } = values;
		const newPost = {
			content,
		};
		mutate({
			topic: post.topic,
			postid: post._id,
			newPost,
		});
	};

	return (
		openEdit && (
			<Formik
				initialValues={{ content: post.content }}
				onSubmit={handleSubmit}
				validationSchema={schema}
			>
				{() => (
					<Form>
						<Field name="content" multiline component={TextFieldForm} />
						<Button size="sm" mr="2" type="submit" isLoading={isLoading}>
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

export default UpdatePost;
