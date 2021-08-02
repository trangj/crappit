import React from "react";
import { Formik, Form } from "formik";
import * as yup from "yup";
import useUpdatePost from "../../hooks/post-query/useUpdatePost";
import { Post } from "src/types/entities/post";
import { Button } from "src/ui/Button";
import { RichTextEditor } from "src/ui/RichTextEditor";

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

	if (!openEdit) return null;

	return (
		<Formik
			initialValues={{ content: post.content }}
			onSubmit={handleSubmit}
			validationSchema={schema}
		>
			{({ values, setFieldValue, isSubmitting }) => (
				<Form>
					<RichTextEditor
						value={values.content}
						placeholder="Text (optional)"
						name="content"
						setFieldValue={setFieldValue}
						isSubmitting={isSubmitting}
					/>
					<div className="flex justify-end gap-2">
						<Button className="w-24" onClick={() => setOpenEdit(false)}>
							Cancel
						</Button>
						<Button
							type="submit"
							loading={isLoading}
							disabled={!!!values.content}
							variant="filled"
							className="w-24"
						>
							Update
						</Button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default UpdatePost;
