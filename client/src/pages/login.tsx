import React from "react";
import toast from "react-hot-toast";
import * as yup from "yup";
import { Formik, Form, Field } from "formik";
import { useUser } from "../context/UserState";
import Link from "next/link";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { TextFieldForm } from "../ui/TextFieldForm";
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
	const router = useRouter();

	const handleSubmit = async ({ email, password }: FormValues) => {
		try {
			const user = {
				email,
				password,
			};
			const res = await loginUser(user);
			toast.success(res.data.status.text);
			router.back();
		} catch (err) {
			toast.error(err.status.text);
		}
	};

	return (
		<Container>
			<Head>
				<title>crappit: Log in</title>
			</Head>
			<Card className="flex">
				<div className="bg-blue-300 w-32" />
				<div className="flex flex-col p-6 gap-2">
					<h4>Login</h4>
					<small>By continuing, you agree to our User Agreement and Privacy Policy.</small>
					<Formik
						initialValues={{ email: "", password: "" }}
						onSubmit={handleSubmit}
						validationSchema={schema}
					>
						{() => (
							<Form className="w-72 flex flex-col">
								<a className="mt-4 text-sm border rounded font-semibold p-4 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-200 dark:hover:text-black" href={process.env.NEXT_PUBLIC_SERVER_URL + '/api/user/google'}>
									CONTINUE WITH GOOGLE
								</a>
								<div className="flex justify-between items-center my-4">
									<span className="border-b border-gray-300 dark:border-gray-700 w-2/5"></span>
									<span className="text-gray-500 dark:text-gray-400">OR</span>
									<span className="border-b border-gray-300 dark:border-gray-700 w-2/5"></span>
								</div>
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
								<Button type="submit" className="mt-3" variant="filled">
									Login
								</Button>
							</Form>
						)}
					</Formik>
					<small className="flex gap-3 mt-3">
						<Link href="/forgot" passHref>
							<a>Forgot your password?</a>
						</Link>
						<Link href="/register" passHref>
							<a className="ml-auto">Sign up for an account!</a>
						</Link>
					</small>
				</div>
			</Card>
		</Container>
	);
};

export default Login;
