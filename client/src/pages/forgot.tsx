import React from "react";
import * as yup from "yup";
import TextFieldForm from "../components/forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { Button, Container, Divider, Heading, useToast } from "@chakra-ui/react";
import axios from "../axiosConfig";
import Card from "../components/utils/Card";
import Head from "next/head";

const schema = yup.object({
	email: yup.string().email("Enter a valid email").required("Enter an email"),
});

interface FormValues {
	email: string;
}

const Forgot = () => {
	const toast = useToast();

	const handleSubmit = async ({ email }: FormValues) => {
		try {
			const res = await axios.post(`/api/user/forgot`, { email });
			toast({
				description: res.data.status.text,
				status: res.data.status.severity
			});
		} catch (err) {
			toast({
				description: err.response.data.status.text,
				status: err.response.data.status.severity
			});
		}
	};

	return (
		<>
			<Head>
				<title>crappit: Reset your password</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Container>
				<Card>
					<Heading mb="3">Forgot</Heading>
					<Divider my="3" />
					<Formik
						initialValues={{ email: "" }}
						onSubmit={handleSubmit}
						validationSchema={schema}
					>
						{() => (
							<Form>
								<h3>
									Forgot your password? Enter your email to change your password.
								</h3>
								<Field
									label="Email"
									name="email"
									type="email"
									component={TextFieldForm}
								/>
								<Button type="submit" mt="2">
									Request Password Change
								</Button>
							</Form>
						)}
					</Formik>
				</Card>
			</Container>
		</>
	);
};

export default Forgot;
