import React from "react";
import { Button } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "../forms/TextFieldForm";
import FileFieldForm from "../forms/FileFieldForm";
import useUpdateTopic from "../../hooks/topic-query/useUpdateTopic";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
const FILE_SIZE = 512 * 1024;
const schema = yup.object({
	description: yup.string().required(""),
	file: yup
		.mixed()
		.test("fileSize", "File Size is too large", (value) =>
			value === undefined ? true : value.size <= FILE_SIZE
		)
		.test("fileType", "Unsupported File Format", (value) =>
			value === undefined ? true : SUPPORTED_FORMATS.includes(value.type)
		),
});

const UpdateTopic = ({ topic }) => {
	const { isLoading, mutate } = useUpdateTopic(topic);

	const handleSubmit = ({ description, file, headline }) => {
		const formData = new FormData();
		formData.append("description", description);
		formData.append("headline", headline);
		formData.append("file", file);
		mutate({ topic: topic.title, formData });
	};

	return (
		<Formik
			initialValues={{
				description: topic.description,
				file: "",
				headline: topic.headline,
			}}
			onSubmit={handleSubmit}
			validationSchema={schema}
		>
			{({ setFieldValue, values }) => (
				<Form>
					<Field
						label="Description"
						name="description"
						multiline
						component={TextFieldForm}
					/>
					<Field label="Headline" name="headline" component={TextFieldForm} />
					<Field
						label="File"
						name="file"
						component={FileFieldForm}
						setFieldValue={setFieldValue}
					/>
					<Button
						mt="2"
						type="submit"
						isLoading={isLoading}
						isDisabled={!!!values.description}
					>
						Update
					</Button>
				</Form>
			)}
		</Formik>
	);
};

export default UpdateTopic;
