import React, { useState, useContext } from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "./Forms/TextFieldForm";
import { GlobalContext } from "../context/GlobalState";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	Button,
} from "@chakra-ui/react";

const schema = yup.object({
	title: yup.string().required(),
	content: yup.string().required(),
});

const UpdatePost = ({ post }) => {
	const { updatePost } = useContext(GlobalContext);
	const [open, setOpen] = useState(false);

	const handleSubmit = (values) => {
		const { title, content } = values;
		const newPost = {
			title,
			content,
		};
		updatePost(post.topic, post._id, newPost);
		setOpen(false);
	};

	return (
		<>
			<Button ml="2" onClick={() => setOpen(true)}>
				Edit
			</Button>
			<Modal isOpen={open} onClose={() => setOpen(false)}>
				<ModalContent>
					<ModalHeader id="form-dialog-title">Edit</ModalHeader>
					<ModalBody>
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
									<Button type="submit">Post</Button>
								</Form>
							)}
						</Formik>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdatePost;
