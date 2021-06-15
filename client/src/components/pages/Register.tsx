import React, { useContext, useState } from "react";
import { Button, Container, Divider, Heading, HStack } from "@chakra-ui/react";
import * as yup from "yup";
import TextFieldForm from "../forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { UserContext } from "../../context/UserState";
import { useHistory } from "react-router";
import AlertStatus from "../utils/AlertStatus";
import Card from "../utils/Card";
import { Link } from "react-router-dom";

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

const Register = () => {
	const { registerUser } = useContext(UserContext);
	const [status, setStatus] = useState(null);
	const history = useHistory();

	const handleSubmit = async ({ username, email, password, password2 }: FormValues) => {
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
					<Link to="/login">
						<small>Already have an account?</small>
					</Link>
				</HStack>
				{status && <AlertStatus status={status} />}
			</Card>
		</Container>
	);
};

export default Register;
