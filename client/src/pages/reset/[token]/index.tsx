import React, { useEffect, useState } from "react";
import * as yup from "yup";
import TextFieldForm from "../../../components/forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { Button, Container, Divider, Heading } from "@chakra-ui/react";
import axios from "../../../axiosConfig";
import AlertStatus from "../../../components/utils/AlertStatus";
import Card from "../../../components/utils/Card";
import { useRouter } from "next/router";

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

const Forgot = () => {
	const [redirect, setRedirect] = useState(false);
	const [status, setStatus] = useState(null);
	const router = useRouter();
	const { token } = router.query;

	useEffect(() => {
		const confirmToken = async () => {
			try {
				const res = await axios.get(`/api/user/reset/${token}`);
				setStatus(res.data);
			} catch (err) {
				setStatus(err.response.data);
			}
		};
		confirmToken();
		// eslint-disable-next-line
	}, [token]);

	const handleSubmit = async ({ password, password2 }: FormValues) => {
		try {
			const res = await axios.post(`/api/user/reset/${token}`, {
				password,
				password2,
			});
			setStatus(res.data);
			setRedirect(true);
		} catch (err) {
			setStatus(err.response.data);
		}
	};

	if (redirect) router.push("/login");

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
							{status && <AlertStatus status={status} />}
						</Form>
					)}
				</Formik>
			</Card>
		</Container>
	);
};

export default Forgot;
