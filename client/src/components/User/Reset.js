import React, { useEffect, useState } from "react";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { Button, Divider, Heading } from "@chakra-ui/react";
import axios from "../../axiosConfig";
import { Redirect } from "react-router";
import AlertStatus from "../Utils/AlertStatus";
import Card from "../Utils/Card";

const schema = yup.object({
	password: yup
		.string()
		.required("Enter a password")
		.min(6, "Your password must be at least 6 characters long")
		.matches(/^(\S+$)/, "Password cannot have any white space"),
	password2: yup
		.string()
		.oneOf([yup.ref("password"), null], "Passwords must match")
		.required("Confirm your password"),
});

const Forgot = ({ match }) => {
	const [redirect, setRedirect] = useState(false);
	const [status, setStatus] = useState(undefined);

	useEffect(() => {
		const confirmToken = async () => {
			try {
				const res = await axios.get(`/api/user/reset/${match.params.token}`);
				setStatus(res.data);
			} catch (err) {
				setStatus(err.response.data);
			}
		};
		confirmToken();
		// eslint-disable-next-line
	}, [match.params.token]);

	const handleSubmit = async ({ password, password2 }) => {
		try {
			const res = await axios.post(`/api/user/reset/${match.params.token}`, {
				password,
				password2,
			});
			setStatus(res.data);
			setRedirect(true);
		} catch (err) {
			setStatus(err.response.data);
		}
	};

	if (redirect)
		return (
			<Redirect
				to={{
					pathname: "/login",
					state: {
						status: status,
					},
				}}
			/>
		);

	return (
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
						{status !== undefined && <AlertStatus status={status} />}
					</Form>
				)}
			</Formik>
		</Card>
	);
};

export default Forgot;
