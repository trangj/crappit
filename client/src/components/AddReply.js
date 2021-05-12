import React, { useState, useContext } from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "./Forms/TextFieldForm";
import { GlobalContext } from "../context/GlobalState";
import {
	ModalBody,
	ModalHeader,
	Modal,
	ModalContent,
	Button,
} from "@chakra-ui/react";

const schema = yup.object({
	content: yup.string().required(),
});

const AddPost = ({ comment }) => {
	const [open, setOpen] = useState(false);

	const { addReply, user } = useContext(GlobalContext);

	const handleSubmit = (values) => {
		const { content } = values;
		const reply = {
			content,
		};
		addReply(comment.topic, comment.post, comment._id, reply);
		setOpen(false);
	};

	return user ? (
		<>
			<Button className="mt-4" onClick={() => setOpen(true)}>
				Reply
			</Button>
			<Modal isOpen={open} onClose={() => setOpen(false)}>
				<ModalContent>
					<ModalHeader id="form-dialog-title">Add a reply!</ModalHeader>
					<ModalBody>
						<Formik
							initialValues={{ content: "" }}
							onSubmit={handleSubmit}
							validationSchema={schema}
						>
							{({ setFieldValue }) => (
								<Form>
									<Field
										label="Content"
										name="content"
										multiline
										component={TextFieldForm}
									/>
									<Button type="submit">Reply</Button>
								</Form>
							)}
						</Formik>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	) : null;
};

export default AddPost;
