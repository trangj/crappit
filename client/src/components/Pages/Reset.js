import React, { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { Button } from "@chakra-ui/react";
import { GlobalContext } from "../../context/GlobalState";
import axiosConfig from "../../axiosConfig";
import { Redirect } from "react-router";

const schema = yup.object({
	password: yup.string().required(),
	password2: yup
		.string()
		.oneOf([yup.ref("password"), null], "Passwords must match")
		.required(),
});

const Forgot = ({ match }) => {
	const { setStatus } = useContext(GlobalContext);
	const [redirect, setRedirect] = useState(false);

	useEffect(() => {
		const confirmToken = async () => {
			try {
				const res = await axiosConfig.get(
					`/api/user/reset/${match.params.token}`
				);
				setStatus({ text: res.data.status, severity: "success" });
			} catch (err) {
				setStatus({ text: err.message, severity: "error" });
			}
		};
		confirmToken();
		// eslint-disable-next-line
	}, [match.params.token]);

	if (redirect) return <Redirect to={`/`} />;

	const handleSubmit = async (values) => {
		const { password, password2 } = values;
		try {
			setStatus({ text: "Awaiting response...", severity: "success" });
			const res = await axiosConfig.post(
				`/api/user/reset/${match.params.token}`,
				{ password, password2 }
			);
			setStatus({ text: res.data.status, severity: "success" });
			setRedirect(true);
		} catch (err) {
			setStatus({ text: err.message, severity: "error" });
		}
	};

	return (
		<Formik
			initialValues={{ password: "", password2: "" }}
			onSubmit={handleSubmit}
			validationSchema={schema}
		>
			{() => (
				<Form>
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
						Post
					</Button>
				</Form>
			)}
		</Formik>
	);
};

export default Forgot;
