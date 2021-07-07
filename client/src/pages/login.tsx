import React, { useState } from "react";
import {
	Button,
	Container,
	Divider,
	Heading,
	HStack,
	Spacer,
} from "@chakra-ui/react";
import * as yup from "yup";
import TextFieldForm from "../components/forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { useUser } from "../context/UserState";
import Link from "next/link";
import AlertStatus from "../components/utils/AlertStatus";
import Card from "../components/utils/Card";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Head from "next/head";

const schema = yup.object({
	email: yup.string().required("Enter your username"),
	password: yup.string().required("Enter your password"),
});

interface FormValues {
	email: string,
	password: string;
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

const Login = () => {
	const { loginUser } = useUser();
	const [status, setStatus] = useState(null);
	const router = useRouter();

	const handleSubmit = async ({ email, password }: FormValues) => {
		try {
			const user = {
				email,
				password,
			};
			await loginUser(user);
			router.back();
		} catch (err) {
			setStatus(err);
		}
	};

	return (
		<>
			<Head>
				<title>crappit: Log in</title>
				<meta name="viewport" content="initial-scale=1.0, width=device-width" />
			</Head>
			<Container>
				<Card>
					<Heading mb="3">Login</Heading>
					<Divider my="3" />
					<Formik
						initialValues={{ email: "", password: "" }}
						onSubmit={handleSubmit}
						validationSchema={schema}
					>
						{() => (
							<Form>
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
								<Button type="submit" mt="2">
									Login
								</Button>
							</Form>
						)}
					</Formik>
					<HStack my="2">
						<Link href="/forgot" passHref>
							<a>
								<small>Forgot your password?</small>
							</a>
						</Link>
						<Spacer />
						<Link href="/register" passHref>
							<a>
								<small>Sign up for an account!</small>
							</a>
						</Link>
					</HStack>
					{status && <AlertStatus status={status} />}
				</Card>
			</Container>
		</>
	);
};

export default Login;
