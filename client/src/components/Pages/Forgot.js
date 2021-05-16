import React, { useContext } from "react";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { Button } from "@chakra-ui/react";
import axiosConfig from "../../axiosConfig";

const schema = yup.object({
	email: yup.string().email().required(),
});

const Forgot = () => {
	const handleSubmit = async (values) => {
		const { email } = values;
		try {
			const res = await axiosConfig.post(`/api/user/forgot`, { email });
		} catch (err) {}
	};

	return (
		<Formik
			initialValues={{ email: "" }}
			onSubmit={handleSubmit}
			validationSchema={schema}
		>
			{() => (
				<Form>
					<h3>
						Forgot your password? Enter your email to change your password.
					</h3>
					<Field label="Email" name="email" component={TextFieldForm} />
					<Button type="submit" mt="2">
						Post
					</Button>
				</Form>
			)}
		</Formik>
	);
};

export default Forgot;
