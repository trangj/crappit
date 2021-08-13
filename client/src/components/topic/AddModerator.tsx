import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as yup from "yup";
import useAddModerator from "../../hooks/topic-query/useAddModerator";
import { Topic } from "src/types/entities/topic";
import { Button } from "../../ui/Button";
import { TextFieldForm } from "../../ui/TextFieldForm";

const schema = yup.object({
	username: yup.string().required(""),
});

type Props = {
	topic: Topic;
};

interface FormValues {
	username: string;
}

const AddModerator = ({ topic }: Props) => {
	const { isLoading, mutate } = useAddModerator(topic);

	const handleSubmit = ({ username }: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
		mutate({
			topic: topic.title,
			username,
		});
		resetForm();
	};

	return (
		<Formik
			initialValues={{ username: "" }}
			onSubmit={handleSubmit}
			validationSchema={schema}
		>
			{({ values }) => (
				<Form className="flex">
					<Field
						placeholder="Add Moderator"
						name="username"
						component={TextFieldForm}
					/>
					<Button
						type="submit"
						loading={isLoading}
						disabled={!!!values.username}
						variant="filled"
						className="flex-none ml-4 mt-2 self-center px-6 h-8"
					>
						Add User
					</Button>
				</Form>
			)}
		</Formik>
	);
};

export default AddModerator;
