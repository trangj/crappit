import React from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import useAddTopic from "../../hooks/topic-query/useAddTopic";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Container } from "../../ui/Container";
import { Divider } from "../../ui/Divider";
import { TextFieldForm } from "../../ui/TextFieldForm";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { useUser } from "src/context/UserState";
import { useRouter } from "next/router";

const schema = yup.object({
	title: yup
		.string()
		.min(3, "Topic title must be at least 3 characters")
		.max(21, "Topic title can be at most 21 characters")
		.required("Enter a title for your topic")
		.matches(
			/^[^\W_]+$/,
			"Title cannot have any white space. Title can only contain letters, numbers, or underscores"
		),
	description: yup
		.string()
		.max(500, "Topic descriptions can be at most 500 characters")
		.required("Enter a description about your topic"),
});

interface FormValues {
	title: string;
	description: string;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	if (!req.cookies["crappit_session"]) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}
	return {
		props: {},
	};
};

const AddTopic = () => {
	const { isLoading, mutate } = useAddTopic();
	const { user } = useUser();
	const router = useRouter();

	if (!user) {
		router.push("/login");
		return null;
	}

	const handleSubmit = ({ title, description }: FormValues) => {
		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		mutate({ formData });
	};

	const initialValues: FormValues = { title: "", description: "" };

	return (
		<Container>
			<Head>
				<title>Create Topic</title>
			</Head>
			<Card className="flex">
				<div className="bg-blue-300 w-32" />
				<div className="flex flex-col p-6 gap-2">
					<h6>Create a topic</h6>
					<Divider />
					<Formik
						initialValues={initialValues}
						onSubmit={handleSubmit}
						validationSchema={schema}
					>
						{({ values, isValid }) => (
							<Form className="w-96 flex flex-col ">
								<Field label="Title" name="title" component={TextFieldForm} />
								<small className="text-gray-500 dark:text-gray-400 mb-3">
									Topic names including capitalization cannot be changed.
								</small>
								<Field
									label="Description"
									name="description"
									multiline
									component={TextFieldForm}
								/>
								<Button
									type="submit"
									loading={isLoading}
									className="mt-3 ml-auto"
									variant="filled"
									disabled={
										!!!values.title || !!!values.description || !isValid
									}
								>
									Create Topic
								</Button>
							</Form>
						)}
					</Formik>
				</div>
			</Card>
		</Container>
	);
};

export default AddTopic;
