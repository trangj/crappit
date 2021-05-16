import React, { useContext, useState } from "react";
import { Button, HStack, Spacer } from "@chakra-ui/react";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { UserContext } from "../../context/UserState";
import { Link, useHistory } from "react-router-dom";
import AlertStatus from "../Utils/AlertStatus";

const schema = yup.object({
	email: yup.string().required(),
	password: yup.string().required(),
});

const Login = (props) => {
	const { loginUser, user: currentUser } = useContext(UserContext);
	const [status, setStatus] = useState(undefined);
	const history = useHistory();

	const handleSubmit = async (values) => {
		try {
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
					props.location.state.status
				) {
					history.push(props.location.state.from);
				} else {
					history.goBack();
				}
			}
		} catch (err) {
			setStatus(err);
		}
	};

	return (
		<>
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
			{status !== undefined && <AlertStatus status={status} />}
			{props.location.state && (
				<AlertStatus status={{ status: props.location.state.status }} />
			)}
		</>
	);
};

export default Login;
