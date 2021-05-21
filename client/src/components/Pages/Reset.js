import React, { useEffect, useState } from "react";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { Button } from "@chakra-ui/react";
import axios from "../../axiosConfig";
import { Redirect } from "react-router";
import AlertStatus from "../Utils/AlertStatus";

const schema = yup.object({
	password: yup.string().required(),
	password2: yup
		.string()
		.oneOf([yup.ref("password"), null], "Passwords must match")
		.required(),
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
		<>
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
			{status !== undefined && <AlertStatus status={status} />}
		</>
	);
};

export default Forgot;
