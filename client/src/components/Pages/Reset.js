import React, { useContext, useEffect } from "react";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { Button } from "@chakra-ui/react";
import { GlobalContext } from "../../context/GlobalState";

const schema = yup.object({
	password: yup.string().required(),
	password2: yup
		.string()
		.oneOf([yup.ref("password"), null], "Passwords must match")
		.required(),
});

const Forgot = ({ match }) => {
	const { setStatus } = useContext(GlobalContext);

	useEffect(() => {
		const confirmToken = async () => {
			try {
				const res = await fetch(
					`http://localhost:5000/api/user/reset/${match.params.token}`
				);
				const data = await res.json();
				setStatus({ text: data.status, severity: "success" });
			} catch (err) {
				setStatus({ text: err.message, severity: "error" });
			}
		};
		confirmToken();
	}, [match.params.token]);

	const handleSubmit = async (values) => {
		const { password, password2 } = values;
		try {
			setStatus({ text: "Awaiting response...", severity: "success" });
			const res = await fetch(
				`http://localhost:5000/api/user/reset/${match.params.token}`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ password, password2 }),
				}
			);
			const data = await res.json();
			setStatus({ text: data.status, severity: "success" });
		} catch (err) {
			setStatus({ text: err.message, severity: "error" });
		}
	};

	return (
		<>
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
		</>
	);
};

export default Forgot;
