import React from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "./Forms/TextFieldForm";
import { Button } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";
import { updatePost } from "../query/post-query";

const schema = yup.object({
	content: yup.string().required(),
});

const UpdatePost = ({ post, openEdit, setOpenEdit }) => {
	const queryClient = useQueryClient();
	const updatePostMutation = useMutation(updatePost, {
		onSuccess: (res) => {
			queryClient.invalidateQueries(["post", res.post._id]);
			setOpenEdit(false);
		},
	});

	const handleSubmit = (values) => {
		const { content } = values;
		const newPost = {
			content,
		};
		updatePostMutation.mutate({
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
						<Button size="sm" mr="2" type="submit">
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
