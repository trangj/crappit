import React from "react";
import { Button, Container, Divider, Heading, HStack, useToast } from "@chakra-ui/react";
import * as yup from "yup";
import TextFieldForm from "../components/forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { useUser } from "../context/UserState";
import Card from "../components/utils/Card";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Head from "next/head";

const schema = yup.object({
	username: yup
		.string()
		.required("Enter an username")
		.matches(/^(\S+$)/, "Username cannot have any white space"),
	email: yup.string().email().required("Enter an email"),
	password: yup
		.string()
		.required("Enter a password")
		.min(6, "Your password must be at least 6 characters long")
		.matches(/^(\S+$)/, "Password cannot have any white space"),
	password2: yup
		.string()
		.oneOf([yup.ref("password"), undefined], "Passwords must match")
		.required("Confirm your password"),
});

interface FormValues {
	username: string,
	email: string,
	password: string,
	password2: string;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	if (req.cookies.token) {
		return {
			redirect: {
				destination: '/',
				permanent: false
			}
		};
	}
	return {
		props: {}
	};
};

const Register = () => {
	const { registerUser } = useUser();
	const toast = useToast();
	const router = useRouter();

	const handleSubmit = async ({ username, email, password, password2 }: FormValues) => {
		try {
			const user = {
				username,
				email,
				password,
				password2,
			};
			const res = await registerUser(user);
			toast({
				description: res.data.status.text,
				status: res.data.status.severity
			});
			router.back();
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
				<title>crappit: Join the worldwide conversation</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Container>
				<Card>
					<Heading mb="3">Register</Heading>
					<Divider my="3" />
					<Formik
						initialValues={{
							username: "",
							email: "",
							password: "",
							password2: "",
						}}
						onSubmit={handleSubmit}
						validationSchema={schema}
					>
						{() => (
							<Form>
								<Field
									label="Username"
									name="username"
									component={TextFieldForm}
								/>
								<Field
									label="Email"
									name="email"
									type="email"
									component={TextFieldForm}
								/>
								<Field
									label="Password"
									name="password"
									type="password"
									component={TextFieldForm}
								/>
								<Field
									label="Confirm Password"
									name="password2"
									type="password"
									component={TextFieldForm}
								/>
								<Button type="submit" mt="2">
									Register
								</Button>
							</Form>
						)}
					</Formik>
					<HStack my="2">
						<Link href="/login">
							<a>
								<small>Already have an account?</small>
							</a>
						</Link>
					</HStack>
				</Card>
			</Container>
		</>
	);
};

export default Register;
