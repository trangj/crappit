import React, { useState, useContext } from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "./Forms/TextFieldForm";
import FileFieldForm from "./Forms/FileFieldForm";
import { GlobalContext } from "../context/GlobalState";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
const FILE_SIZE = 320 * 1024;
const schema = yup.object({
	description: yup.string().required(),
	file: yup
		.mixed()
		.test("fileSize", "File Size is too large", (value) =>
			value === undefined ? true : value.size <= FILE_SIZE
		)
		.test("fileType", "Unsupported File Format", (value) =>
			value === undefined ? true : SUPPORTED_FORMATS.includes(value.type)
		),
});

const AddTopic = ({ topic }) => {
	const [open, setOpen] = useState(false);
	const { updateTopic, user } = useContext(GlobalContext);

	const handleSubmit = (values) => {
		const { description, file } = values;
		const formData = new FormData();
		formData.append("description", description);
		formData.append("file", file);
		updateTopic(formData);
		setOpen(false);
	};

	return topic.moderator.includes(user._id) ? (
		<>
			<Button onClick={() => setOpen(true)}>Edit</Button>
			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle id="form-dialog-title">Update a topic!</DialogTitle>
				<DialogContent>
					<Formik
						initialValues={{ description: "", file: "" }}
						onSubmit={handleSubmit}
						validationSchema={schema}
					>
						{({ setFieldValue }) => (
							<Form>
								<Field
									label="Description"
									name="description"
									multiline
									component={TextFieldForm}
								/>
								<Field
									label="File"
									name="file"
									component={FileFieldForm}
									setFieldValue={setFieldValue}
								/>
								<Button type="submit">Post</Button>
							</Form>
						)}
					</Formik>
				</DialogContent>
			</Dialog>
		</>
	) : null;
};

export default AddTopic;
