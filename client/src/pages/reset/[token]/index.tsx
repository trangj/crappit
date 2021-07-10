import React, { useEffect } from "react";
import * as yup from "yup";
import TextFieldForm from "../../../components/forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { Button, Container, Divider, Heading, useToast } from "@chakra-ui/react";
import axios from "../../../axiosConfig";
import Card from "../../../components/utils/Card";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

const schema = yup.object({
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
	password: string,
	password2: string;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	try {
		const res = await axios.get(`/api/user/reset/${query.token}`);
		return {
			props: {
				status: res.data
			}
		};
	} catch (err) {
		return {
			props: {
				status: err.response.data
			}
		};
	}
};

const Forgot = ({ status }: any) => {
	const router = useRouter();
	const toast = useToast();
	const { token } = router.query;

	useEffect(() => {
		if (status) {
			toast({
				status: status.status.severity,
				description: status.status.text
			});
			if (status.status.severity === 'error') {
				router.push('/');
			}
		}
	}, [status]);

	const handleSubmit = async ({ password, password2 }: FormValues) => {
		try {
			const res = await axios.post(`/api/user/reset/${token}`, {
				password,
				password2,
			});
			toast({
				status: res.data.status.severity,
				description: res.data.status.text
			});
			router.push("/login");
		} catch (err) {
			toast({
				status: err.response.data.status.severity,
				description: err.response.data.status.text
			});
		}
	};

	return (
		<Container>
			<Card>
				<Heading mb="3">Forgot</Heading>
				<Divider my="3" />
				<Formik
					initialValues={{ password: "", password2: "" }}
					onSubmit={handleSubmit}
					validationSchema={schema}
				>
					{() => (
						<Form>
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
								Post
							</Button>
						</Form>
					)}
				</Formik>
			</Card>
		</Container>
	);
};

export default Forgot;
