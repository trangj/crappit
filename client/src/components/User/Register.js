import React, { useState, useContext } from "react";
import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from "@chakra-ui/react";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { GlobalContext } from "../../context/GlobalState";

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
	const { registerUser } = useContext(GlobalContext);
	const [open, setOpen] = useState(false);

	const handleSubmit = (values) => {
		const { username, email, password, password2 } = values;
		const user = {
			username,
			email,
			password,
			password2,
		};
		registerUser(user);
		setOpen(false);
	};

	return (
		<>
			<Button onClick={() => setOpen(true)} color="inherit">
				Register
			</Button>
			<Modal isOpen={open} onClose={() => setOpen(false)}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader id="form-dialog-title">Register</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
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
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default Register;
