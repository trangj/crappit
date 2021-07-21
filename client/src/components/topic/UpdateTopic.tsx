import React from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "../../ui/TextFieldForm";
import useUpdateTopic from "../../hooks/topic-query/useUpdateTopic";
import { Topic } from "src/types/entities/topic";
import { Button } from "src/ui";

const schema = yup.object({
	description: yup.string().required(""),
});

type Props = {
	topic: Topic;
};

interface FormValues {
	description: string,
	headline: string;
}

const UpdateTopic = ({ topic }: Props) => {
	const { isLoading, mutate } = useUpdateTopic(topic);

	const handleSubmit = ({ description, headline }: FormValues) => {
		const newTopic = {
			description,
			headline
		};
		mutate({ topic: topic.title, newTopic });
	};

	const initialValues: FormValues = {
		description: topic.description,
		headline: topic.headline,
	};

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={handleSubmit}
			validationSchema={schema}
		>
			{({ values }) => (
				<Form>
					<Field
						label="Description"
						name="description"
						multiline
						component={TextFieldForm}
					/>
					<Field label="Headline" name="headline" component={TextFieldForm} />
					<Button
						type="submit"
						loading={isLoading}
						disabled={!!!values.description}
						className="mt-3"
						variant='filled'
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
