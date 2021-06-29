import React from "react";
import { Button, Heading, Divider, Container } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "../../components/forms/TextFieldForm";
import FileFieldForm from "../../components/forms/FileFieldForm";
import useAddTopic from "../../hooks/topic-query/useAddTopic";
import Card from "../../components/utils/Card";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
const FILE_SIZE = 10485760;
const schema = yup.object({
	title: yup
		.string()
		.required("Enter a title for your topic")
		.matches(/^(\S+$)/, "Title cannot have any white space"),
	description: yup.string().required("Enter a description about your topic"),
	file: yup
		.mixed()
		.test("fileSize", "File Size is too large", (value) =>
			value === undefined ? true : value.size <= FILE_SIZE
		)
		.test("fileType", "Unsupported File Format", (value) =>
			value === undefined ? true : SUPPORTED_FORMATS.includes(value.type)
		),
});

interface FormValues {
	title: string,
	description: string,
	file: File | "";
};

const AddTopic = () => {
	const { isLoading, mutate } = useAddTopic();
	const handleSubmit = ({ title, description, file }: FormValues) => {
		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		formData.append("file", file);
		mutate({ formData });
	};
	const initialValues: FormValues = { title: "", description: "", file: "" };

	return (
		<Container>
			<Card>
				<Heading>Create a topic</Heading>
				<Divider my="3" />
				<Formik
					initialValues={initialValues}
					onSubmit={handleSubmit}
					validationSchema={schema}
				>
					{({ setFieldValue, values }) => (
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
							<Button
								type="submit"
								isLoading={isLoading}
								mt="2"
								isDisabled={!!!values.title || !!!values.description}
							>
								Post
							</Button>
						</Form>
					)}
				</Formik>
			</Card>
		</Container>
	);
};

export default AddTopic;
