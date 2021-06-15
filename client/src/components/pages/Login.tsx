import React, { useContext, useState } from "react";
import {
	Button,
	Container,
	Divider,
	Heading,
	HStack,
	Spacer,
} from "@chakra-ui/react";
import * as yup from "yup";
import TextFieldForm from "../forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { UserContext } from "../../context/UserState";
import { Link, RouteComponentProps, useHistory } from "react-router-dom";
import AlertStatus from "../utils/AlertStatus";
import Card from "../utils/Card";
import { Error } from "src/types/error";

const schema = yup.object({
	email: yup.string().required("Enter your username"),
	password: yup.string().required("Enter your password"),
});

interface LocationParams {
	status: Error,
	from: string,
}

interface Props extends RouteComponentProps<{}, any, LocationParams> { }

interface FormValues {
	email: string,
	password: string;
}

const Login = ({ location }: Props) => {
	const { loginUser } = useContext(UserContext);
	const [status, setStatus] = useState(null);
	const history = useHistory();

	const handleSubmit = async ({ email, password }: FormValues) => {
		try {
			const user = {
				email,
				password,
			};
			await loginUser(user);
			if (
				location &&
				location.state &&
				location.state.status
			) {
				history.push(location.state.from);
			} else {
				history.goBack();
			}
		} catch (err) {
			setStatus(err);
		}
	};

	return (
		<Container>
			<Card>
				<Heading mb="3">Login</Heading>
				<Divider my="3" />
				<Formik
					initialValues={{ email: "", password: "" }}
					onSubmit={handleSubmit}
					validationSchema={schema}
				>
					{() => (
						<Form>
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
							<Button type="submit" mt="2">
								Login
							</Button>
						</Form>
					)}
				</Formik>
				<HStack my="2">
					<Link to="/forgot">
						<small>Forgot your password?</small>
					</Link>
					<Spacer />
					<Link to="/register">
						<small>Sign up for an account!</small>
					</Link>
				</HStack>
				{status && <AlertStatus status={status} />}
				{location.state && (
					<AlertStatus status={location.state.status} />
				)}
			</Card>
		</Container>
	);
};

export default Login;
