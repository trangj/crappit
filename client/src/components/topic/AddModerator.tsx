import React from "react";
import { Formik, Form, Field } from "formik";
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

interface FormData {
	username: string;
}

const AddModerator = ({ topic }: Props) => {
	const { isLoading, mutate } = useAddModerator(topic);

	const handleSubmit = ({ username }: FormData) => {
		mutate({
			topic: topic.title,
			username,
		});
	};

	return (
		<Formik
			initialValues={{ username: "" }}
			onSubmit={handleSubmit}
			validationSchema={schema}
		>
			{({ values }) => (
				<Form>
					<Field
						label="Add Moderator"
						name="username"
						component={TextFieldForm}
					/>

					<Button
						type="submit"
						loading={isLoading}
						disabled={!!!values.username}
						className="mt-3 ml-auto"
						variant="filled"
					>
						Invite user as mod
					</Button>
				</Form>
			)}
		</Formik>
	);
};

export default AddModerator;
