import React from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Button } from "@chakra-ui/react";
import useUpdatePost from "../../hooks/post-query/useUpdatePost";

const schema = yup.object({
	content: yup.string().required(""),
});

const UpdatePost = ({ post, openEdit, setOpenEdit }) => {
	const { isLoading, mutate } = useUpdatePost(setOpenEdit, post);

	const handleSubmit = ({ content }) => {
		const newPost = {
			content,
		};
		mutate({
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
				{({ values }) => (
					<Form>
						<Field name="content" multiline component={TextFieldForm} />
						<Button
							size="sm"
							mr="2"
							type="submit"
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

export default UpdatePost;
