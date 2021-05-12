import React, { useContext } from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "./Forms/TextFieldForm";
import { GlobalContext } from "../context/GlobalState";
import { Button } from "@chakra-ui/react";

const schema = yup.object({
	title: yup.string().required(),
	content: yup.string().required(),
});

const UpdatePost = ({ post, openEdit, setOpenEdit }) => {
	const { updatePost } = useContext(GlobalContext);

	const handleSubmit = (values) => {
		const { title, content } = values;
		const newPost = {
			title,
			content,
		};
		updatePost(post.topic, post._id, newPost);
		setOpenEdit(false);
	};

	return (
		openEdit && (
			<Formik
				initialValues={{ title: post.title, content: post.content }}
				onSubmit={handleSubmit}
				validationSchema={schema}
			>
				{() => (
					<Form>
						<Field label="Title" name="title" component={TextFieldForm} />
						<Field
							label="Content"
							name="content"
							multiline
							component={TextFieldForm}
						/>
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
