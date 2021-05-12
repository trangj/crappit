import React, { useContext } from "react";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { Button } from "@chakra-ui/react";
import { GlobalContext } from "../../context/GlobalState";
import axiosConfig from "../../axiosConfig";

const schema = yup.object({
	email: yup.string().email().required(),
});

const Forgot = () => {
	const { setStatus } = useContext(GlobalContext);

	const handleSubmit = async (values) => {
		const { email } = values;
		try {
			setStatus({ text: "Awaiting response...", severity: "success" });
			const res = await axiosConfig.post(`/api/user/forgot`, { email });
			console.log(res.data);
			setStatus({ text: res.data.status, severity: "success" });
		} catch (err) {
			setStatus({ text: err.message, severity: "error" });
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
					</Form>
				)}
			</Formik>
		</>
	);
};

export default Forgot;
