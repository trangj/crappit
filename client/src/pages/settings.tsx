import React, { FormEventHandler, useState } from "react";
import {
	Button,
	Heading,
	Text,
	Divider,
	FormControl,
	FormLabel,
	Input,
	Container,
	useToast
} from "@chakra-ui/react";
import { useUser } from "../context/UserState";
import axios from "../axiosConfig";
import Card from "../components/utils/Card";
import Head from "next/head";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	if (!req.cookies.token) {
		return {
			redirect: {
				destination: '/login',
				permanent: false
			}
		};
	}
	return {
		props: {}
	};
};

const Settings = () => {
	const { user, setUser } = useUser();
	const toast = useToast();
	const [newEmail, setNewEmail] = useState("");
	const [password, setPassword] = useState("");

	const handlePassword = async (email: string) => {
		try {
			const res = await axios.post(`/api/user/forgot`, { email });
			toast({
				status: res.data.status.severity,
				description: res.data.status.text
			});
		} catch (err) {
			toast({
				status: err.response.data.status.severity,
				description: err.response.data.status.text
			});
		}
	};

	const handleEmail: FormEventHandler = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post("/api/user/email", { newEmail, password });
			setUser({ ...user, email: res.data.user.email });
			toast({
				status: res.data.status.severity,
				description: res.data.status.text
			});
		} catch (err) {
			toast({
				status: err.response.data.status.severity,
				description: err.response.data.status.text
			});
		}
	};

	return (
		<>
			<Head>
				<title>Crappit Settings</title>
			</Head>
			<Container>
				<Card>
					<Heading>Settings</Heading>
					<Divider my="3" />
					<Heading mb="3" size="md">
						Change password
					</Heading>
					<Button onClick={() => handlePassword(user.email)}>
						Request Password Change
					</Button>
					<Divider my="3" />
					<form onSubmit={handleEmail}>
						<FormControl>
							<Heading size="md">Email address</Heading>
							<Text mb="3">Your current email: {user.email}</Text>
							<FormLabel>New Email</FormLabel>
							<Input
								type="email"
								value={newEmail}
								isRequired={true}
								onChange={(e) => setNewEmail(e.target.value)}
							/>
							<FormLabel>Current Password</FormLabel>
							<Input
								type="password"
								value={password}
								isRequired={true}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<Button type="submit" mt="3">
								Change Email
							</Button>
						</FormControl>
					</form>
				</Card>
			</Container>
		</>
	);
};

export default Settings;
