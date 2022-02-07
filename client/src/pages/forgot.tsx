import React from "react";
import * as yup from "yup";
import { Formik, Form, Field } from "formik";
import toast from "react-hot-toast";
import axios from "../axiosConfig";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
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
			<Card className="flex">
				<div className="bg-blue-300 w-32" />
				<div className="flex flex-col p-6 gap-3 w-96">
					<h6>Reset your password</h6>
					<div>
						Tell us the email address associated with your Reddit account, and
						we’ll send you an email with a link to reset your password.
					</div>
					<Formik
						initialValues={{ email: "" }}
						onSubmit={handleSubmit}
						validationSchema={schema}
					>
						{({ isValid }) => (
							<Form>
								<Field
									label="Email"
									name="email"
									type="email"
									component={TextFieldForm}
								/>
								<Button
									type="submit"
									variant="filled"
									className="px-5 mt-3"
									disabled={!isValid}
								>
									Reset Password
								</Button>
							</Form>
						)}
					</Formik>
				</div>
			</Card>
		</Container>
	);
};

export default Forgot;
