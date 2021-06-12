import React from "react";
import { Formik, Form, Field } from "formik";
import TextFieldForm from "../forms/TextFieldForm";
import * as yup from "yup";
import useAddModerator from "../../hooks/topic-query/useAddModerator";
import { Button } from "@chakra-ui/button";

const schema = yup.object({
	username: yup.string().required(""),
});

const AddModerator = ({ topic }) => {
	const { isLoading, mutate } = useAddModerator(topic.title);

	const handleSubmit = ({ username }) => {
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
						isLoading={isLoading}
						mt="2"
						isDisabled={!!!values.username}
					>
						Add Moderator
					</Button>
				</Form>
			)}
		</Formik>
	);
};

export default AddModerator;
