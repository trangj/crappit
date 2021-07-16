import React from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "../../ui/TextFieldForm";
import FileFieldForm from "../../ui/FileFieldForm";
import useUpdateTopic from "../../hooks/topic-query/useUpdateTopic";
import { Topic } from "src/types/entities/topic";
import { Button } from "src/ui";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
const FILE_SIZE = 10485760;
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

type Props = {
	topic: Topic;
};

interface FormValues {
	description: string,
	file: File | "",
	headline: string;
}

const UpdateTopic = ({ topic }: Props) => {
	const { isLoading, mutate } = useUpdateTopic(topic);

	const handleSubmit = ({ description, file, headline }: FormValues) => {
		const formData = new FormData();
		formData.append("description", description);
		formData.append("headline", headline);
		formData.append("file", file);
		mutate({ topic: topic.title, formData });
	};

	const initialValues: FormValues = {
		description: topic.description,
		file: "",
		headline: topic.headline,
	};

	return (
		<Formik
			initialValues={initialValues}
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
						type="submit"
						loading={isLoading}
						disabled={!!!values.description}
						className="mt-3"
						fullWidth
					>
						Update
					</Button>
				</Form>
			)}
		</Formik>
	);
};

export default UpdateTopic;
