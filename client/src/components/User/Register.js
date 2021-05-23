import React, { useContext, useState } from "react";
import { Button, Heading } from "@chakra-ui/react";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { UserContext } from "../../context/UserState";
import { useHistory } from "react-router";
import AlertStatus from "../Utils/AlertStatus";
import Card from "../Utils/Card";

const schema = yup.object({
	username: yup.string().required(),
	email: yup.string().email().required(),
	password: yup.string().required(),
	password2: yup
		.string()
		.oneOf([yup.ref("password"), null], "Passwords must match")
		.required(),
});

const Register = () => {
	const { registerUser } = useContext(UserContext);
	const [status, setStatus] = useState(undefined);
	const history = useHistory();

	const handleSubmit = async ({ username, email, password, password2 }) => {
		try {
			const user = {
				username,
				email,
				password,
				password2,
			};
			await registerUser(user);
			history.goBack();
		} catch (err) {
			setStatus(err);
		}
	};

	return (
		<Card>
			<Heading mb="3">Register</Heading>
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
						<Field label="Username" name="username" component={TextFieldForm} />
						<Field label="Email" name="email" component={TextFieldForm} />
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
			{status !== undefined && <AlertStatus status={status} />}
		</Card>
	);
};

export default Register;
