import React from "react";
import toast from "react-hot-toast";
import * as yup from "yup";
import { Formik, Form, Field } from "formik";
import { useUser } from "../context/UserState";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { TextFieldForm } from "../ui/TextFieldForm";
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
	username: string;
	email: string;
	password: string;
	password2: string;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	if (req.cookies["crappit_session"]) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	return {
		props: {},
	};
};

const Register = () => {
	const { registerUser } = useUser();
	const router = useRouter();

	const handleSubmit = async ({
		username,
		email,
		password,
		password2,
	}: FormValues) => {
		try {
			const user = {
				username,
				email,
				password,
				password2,
			};
			const res = await registerUser(user);
			toast.success(res.data.status.text);
			router.back();
		} catch (err) {
			toast.error(err.status.text);
		}
	};

	return (
		<Container>
			<Head>
				<title>crappit: Join the worldwide conversation</title>
			</Head>
			<Card className="flex">
				<div className="bg-blue-300 w-32" />
				<div className="flex flex-col p-6 my-4 gap-2">
					<h6>Register</h6>
					<small>
						By continuing, you agree to our User Agreement and Privacy Policy.
					</small>
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
							<Form className="w-72 flex flex-col">
								<a
									className="uppercase mt-4 text-sm border rounded font-semibold p-4 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-200 dark:hover:text-black"
									href={process.env.NEXT_PUBLIC_SERVER_URL + "/api/user/google"}
								>
									Continue with Google
								</a>
								<div className="flex justify-between items-center my-4">
									<span className="border-b border-gray-300 dark:border-gray-700 w-2/5"></span>
									<span className="text-gray-500 dark:text-gray-400">OR</span>
									<span className="border-b border-gray-300 dark:border-gray-700 w-2/5"></span>
								</div>
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
								<Button type="submit" variant="filled" className="mt-3">
									Register
								</Button>
							</Form>
						)}
					</Formik>
					<small className="mt-4">
						Already a crappitor?{" "}
						<Link href="/login">
							<a className="text-blue-500 dark:text-blue-400">Log in</a>
						</Link>
					</small>
				</div>
			</Card>
		</Container>
	);
};

export default Register;
