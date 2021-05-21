import React, { useState } from "react";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { Button } from "@chakra-ui/react";
import axios from "../../axiosConfig";
import AlertStatus from "../Utils/AlertStatus";

const schema = yup.object({
	email: yup.string().email().required(),
});

const Forgot = () => {
	const [status, setStatus] = useState(undefined);
	const handleSubmit = async ({ email }) => {
		try {
			const res = await axios.post(`/api/user/forgot`, { email });
			setStatus(res.data);
		} catch (err) {
			setStatus(err.response.data);
		}
	};

	return (
		<>
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
						{status !== undefined && <AlertStatus status={status} />}
					</Form>
				)}
			</Formik>
		</>
	);
};

export default Forgot;
