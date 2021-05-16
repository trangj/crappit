import React, { useContext } from "react";
import { Alert, AlertIcon, Button, HStack, Spacer } from "@chakra-ui/react";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { UserContext } from "../../context/UserState";
import { Link, useHistory } from "react-router-dom";

const schema = yup.object({
	email: yup.string().required(),
	password: yup.string().required(),
});

const Login = (props) => {
	const { loginUser, user: currentUser } = useContext(UserContext);
	const history = useHistory();

	const handleSubmit = async (values) => {
		const { email, password } = values;
		const user = {
			email,
			password,
		};
		await loginUser(user);
		if (currentUser !== undefined) {
			if (
				props.location &&
				props.location.state &&
				props.location.state.error
			) {
				history.push(props.location.state.from);
			} else {
				history.goBack();
			}
		}
	};

	return (
		<>
			{props.location.state && (
				<Alert variant="solid" status="error">
					<AlertIcon />
					{props.location.state.error}
				</Alert>
			)}
			<Formik
				initialValues={{ email: "", password: "" }}
				onSubmit={handleSubmit}
				validationSchema={schema}
			>
				{() => (
					<Form>
						<Field label="Email" name="email" component={TextFieldForm} />
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
			<HStack>
				<Link to="/forgot">
					<small>Forgot your password?</small>
				</Link>
				<Spacer />
				<Link to="/register">
					<small>Sign up for an account!</small>
				</Link>
			</HStack>
		</>
	);
};

export default Login;
