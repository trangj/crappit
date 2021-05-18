import React, { useContext } from "react";
import { Button, Heading, Divider } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import FileFieldForm from "../Forms/FileFieldForm";
import AlertStatus from "../Utils/AlertStatus";
import { UserContext } from "../../context/UserState";
import useAddTopic from "../../hooks/topic-query/useAddTopic";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
const FILE_SIZE = 320 * 1024;
const schema = yup.object({
	title: yup.string().required(),
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

const AddTopic = () => {
	const { setUser } = useContext(UserContext);
	const { isLoading, isError, error, mutate } = useAddTopic(setUser);
	const handleSubmit = async (values) => {
		const { title, description, file } = values;
		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		formData.append("file", file);
		mutate({ formData });
	};

	return (
		<>
			<Heading>Create a topic</Heading>
			<Divider my="3" />
			<Formik
				initialValues={{ title: "", description: "", file: "" }}
				onSubmit={handleSubmit}
				validationSchema={schema}
			>
				{({ setFieldValue }) => (
					<Form>
						<Field label="Title" name="title" component={TextFieldForm} />
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
						<Button type="submit" isLoading={isLoading}>
							Post
						</Button>
					</Form>
				)}
			</Formik>
			{isError && <AlertStatus status={error} />}
		</>
	);
};

export default AddTopic;
