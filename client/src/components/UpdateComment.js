import React, { useContext, useState } from "react";
import * as yup from "yup";
import TextFieldForm from "./Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { GlobalContext } from "../context/GlobalState";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	Button,
} from "@chakra-ui/react";

const schema = yup.object({
	content: yup.string().required(),
});

const UpdateComment = ({ comment }) => {
	const [open, setOpen] = useState(false);
	const { updateComment } = useContext(GlobalContext);

	const handleSubmit = (values) => {
		const { content } = values;
		const newComment = {
			content,
		};
		updateComment(comment.topic, comment.post, comment._id, newComment);
		setOpen(false);
	};

	return (
		<>
			<Button className="mt-4" onClick={() => setOpen(true)}>
				Edit
			</Button>
			<Modal isOpen={open} onClose={() => setOpen(false)}>
				<ModalContent>
					<ModalHeader id="form-dialog-title">Edit Comment</ModalHeader>
					<ModalBody>
						<Formik
							initialValues={{ content: comment.content }}
							onSubmit={handleSubmit}
							validationSchema={schema}
						>
							{() => (
								<Form>
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

export default UpdateComment;
