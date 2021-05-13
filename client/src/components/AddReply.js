import React, { useContext } from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "./Forms/TextFieldForm";
import { GlobalContext } from "../context/GlobalState";
import { Button } from "@chakra-ui/react";

const schema = yup.object({
	content: yup.string().required(),
});

const AddPost = ({ comment, openReply, setOpenReply }) => {
	const { addReply } = useContext(GlobalContext);

	const handleSubmit = (values) => {
		const { content } = values;
		const reply = {
			content,
		};
		addReply(comment.topic, comment.post, comment._id, reply);
		setOpenReply(false);
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

export default AddPost;
