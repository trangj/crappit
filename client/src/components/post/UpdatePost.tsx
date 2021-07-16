import React from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "../../ui/TextFieldForm";
import useUpdatePost from "../../hooks/post-query/useUpdatePost";
import { Post } from "src/types/entities/post";
import { Button } from "src/ui";

const schema = yup.object({
	content: yup.string().required(""),
});

type Props = {
	post: Post;
	openEdit: boolean,
	setOpenEdit: (arg: boolean) => void;
};

interface FormData {
	content: string;
}

const UpdatePost = ({ post, openEdit, setOpenEdit }: Props) => {
	const { isLoading, mutate } = useUpdatePost(setOpenEdit, post);

	const handleSubmit = ({ content }: FormData) => {
		const newPost = {
			content,
		};
		mutate({
			postid: post.id,
			newPost,
		});
	};

	return (
		openEdit ? (
			<Formik
				initialValues={{ content: post.content }}
				onSubmit={handleSubmit}
				validationSchema={schema}
			>
				{({ values }) => (
					<Form>
						<Field name="content" multiline component={TextFieldForm} />
						<Button
							type="submit"
							loading={isLoading}
							disabled={!!!values.content}
						>
							Update
						</Button>
						<Button onClick={() => setOpenEdit(false)}>
							Cancel
						</Button>
					</Form>
				)}
			</Formik>
		) : null
	);
};

export default UpdatePost;
