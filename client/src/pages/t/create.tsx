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
		.required("Enter a title for your topic")
		.matches(/^(\S+$)/, "Title cannot have any white space"),
	description: yup.string().required("Enter a description about your topic"),
});

interface FormValues {
	title: string,
	description: string,
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	if (!req.cookies.token) {
		return {
			redirect: {
				destination: '/login',
				permanent: false
			}
		};
	}
	return {
		props: {}
	};
};

const AddTopic = () => {
	const { isLoading, mutate } = useAddTopic();
	const { user } = useUser();
	const router = useRouter();

	if (!user) {
		router.push('/login');
		return null;
	};

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
					<h5>Create a topic</h5>
					<Divider />
					<Formik
						initialValues={initialValues}
						onSubmit={handleSubmit}
						validationSchema={schema}
					>
						{({ values }) => (
							<Form className="w-96 flex flex-col ">
								<Field label="Title" name="title" component={TextFieldForm} />
								<small className="text-gray-500 dark:text-gray-400 mb-3">Topic names including capitalization cannot be changed.</small>
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
									disabled={!!!values.title || !!!values.description}
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
