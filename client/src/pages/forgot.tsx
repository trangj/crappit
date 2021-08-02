import React from "react";
import * as yup from "yup";
import { Formik, Form, Field } from "formik";
import toast from "react-hot-toast";
import axios from "../axiosConfig";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { Divider } from "../ui/Divider";
import { TextFieldForm } from "../ui/TextFieldForm";
import Head from "next/head";

const schema = yup.object({
	email: yup.string().email("Enter a valid email").required("Enter an email"),
});

interface FormValues {
	email: string;
}

const Forgot = () => {
	const handleSubmit = async ({ email }: FormValues) => {
		try {
			const res = await axios.post(`/api/user/forgot`, { email });
			toast.success(res.data.status.text);
		} catch (err) {
			toast.error(err.response.data.status.text);
		}
	};

	return (
		<Container>
			<Head>
				<title>crappit: Reset your password</title>
			</Head>
			<Card className="flex flex-col gap-2 p-3">
				<h5>Forgot</h5>
				<Divider />
				<Formik
					initialValues={{ email: "" }}
					onSubmit={handleSubmit}
					validationSchema={schema}
				>
					{() => (
						<Form>
							<h6>
								Forgot your password? Enter your email to change your password.
							</h6>
							<Field
								label="Email"
								name="email"
								type="email"
								component={TextFieldForm}
							/>
							<Button type="submit" variant="filled" className="px-5 mt-3">
								Request Password Change
							</Button>
						</Form>
					)}
				</Formik>
			</Card>
		</Container>
	);
};

export default Forgot;
