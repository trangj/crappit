import React, { useContext } from "react";
import * as yup from "yup";
import TextFieldForm from "./Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { GlobalContext } from "../context/GlobalState";
import { Button } from "@chakra-ui/react";

const schema = yup.object({
	content: yup.string().required(),
});

const UpdateComment = ({ comment, openEdit, setOpenEdit }) => {
	const { updateComment } = useContext(GlobalContext);

	const handleSubmit = (values) => {
		const { content } = values;
		const newComment = {
			content,
		};
		updateComment(comment.topic, comment.post, comment._id, newComment);
		setOpenEdit(false);
	};

	return (
		openEdit && (
			<Formik
				initialValues={{ content: comment.content }}
				onSubmit={handleSubmit}
				validationSchema={schema}
			>
				{() => (
					<Form>
						<Field name="content" multiline component={TextFieldForm} />
						<Button type="submit" mr="2" size="sm">
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

export default UpdateComment;
