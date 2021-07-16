import React, { useEffect } from "react";
import * as yup from "yup";
import TextFieldForm from "../ui/TextFieldForm";
import { Formik, Form, Field } from "formik";
import toast from "react-hot-toast";
import axios from "../axiosConfig";
import { Button, Card } from "../ui";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useUser } from "../context/UserState";

const schema = yup.object({
	password: yup
		.string()
		.required("Enter a password")
		.min(6, "Your password must be at least 6 characters long")
		.matches(/^(\S+$)/, "Password cannot have any white space"),
	password2: yup
		.string()
		.oneOf([yup.ref("password"), undefined], "Passwords must match")
		.required("Confirm your password"),
});

interface FormValues {
	password: string,
	password2: string;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	try {
		const res = await axios.get(`/api/user/reset/${query.token}`);
		return {
			props: {
				status: res.data
			}
		};
	} catch (err) {
		return {
			props: {
				status: err.response.data
			}
		};
	}
};

const Forgot = ({ status }: any) => {
	const router = useRouter();
	const { setUser, setToken } = useUser();
	const { token } = router.query;

	useEffect(() => {
		if (status) {
			toast.success(status.status.text);
			if (status.status.severity === 'error') {
				router.push('/');
			}
		}
	}, [status, router]);

	const handleSubmit = async ({ password, password2 }: FormValues) => {
		try {
			const res = await axios.post(`/api/user/reset/${token}`, {
				password,
				password2,
			});
			toast.success(res.data.status.text);
			setUser(null);
			setToken("");
			router.push("/login");
		} catch (err) {
			toast.error(err.response.data.status.text);
		}
	};

	return (
		<div className="mt-16 container mx-auto max-w-5xl">
			<Card className="p-3 flex flex-col gap-2">
				<h5>Forgot</h5>
				<hr className="border-gray-500" />
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
							<Button type="submit" variant="filled" className="ml-auto mt-3 px-3">
								Change Password
							</Button>
						</Form>
					)}
				</Formik>
			</Card>
		</div>
	);
};

export default Forgot;
