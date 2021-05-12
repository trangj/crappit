import React, { useState, useContext } from "react";
import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
} from "@chakra-ui/react";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { GlobalContext } from "../../context/GlobalState";
import { Link } from "react-router-dom";

const schema = yup.object({
	email: yup.string().required(),
	password: yup.string().required(),
});

const Login = () => {
	const { loginUser } = useContext(GlobalContext);
	const [open, setOpen] = useState(false);

	const handleSubmit = (values) => {
		const { email, password } = values;
		const user = {
			email,
			password,
		};
		loginUser(user);
		setOpen(false);
	};

	return (
		<>
			<Button onClick={() => setOpen(true)}>Login</Button>
			<Modal isOpen={open} onClose={() => setOpen(false)}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader id="title">Login</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
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
						<Link to="/forgot" onClick={() => setOpen(false)}>
							<div style={{ marginTop: ".5rem" }}>
								<small>Forgot your password?</small>
							</div>
						</Link>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default Login;
