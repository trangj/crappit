import React, { FormEventHandler, useState } from "react";
import toast from 'react-hot-toast';
import { useUser } from "../context/UserState";
import axios from "../axiosConfig";
import { Button, Card, Divider } from "../ui";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

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
	const router = useRouter();
	const [newEmail, setNewEmail] = useState("");
	const [password, setPassword] = useState("");

	if (!user) return router.push('/login');

	const handlePassword = async (email: string) => {
		try {
			const res = await axios.post(`/api/user/forgot`, { email });
			toast.success(res.data.status.text);
		} catch (err) {
			toast.error(err.response.data.status.text);
		}
	};

	const handleEmail: FormEventHandler = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post("/api/user/email", { newEmail, password });
			setUser({ ...user, email: res.data.user.email });
			toast.success(res.data.status.text);
		} catch (err) {
			toast.error(err.response.data.status.text);
		}
	};

	return (
		<div className="mt-16 container mx-auto max-w-5xl">
			<Head>
				<title>Crappit Settings</title>
			</Head>
			<Card className="flex flex-col gap-2 p-3">
				<h5>Settings</h5>
				<Divider />
				<h6>
					Change password
				</h6>
				<Button onClick={() => handlePassword(user.email)} variant="filled">
					Request Password Change
				</Button>
				<Divider className="my-3" />
				<form onSubmit={handleEmail}>
					<h5>Email address</h5>
					<p>Your current email: {user.email}</p>
					<h6>New Email</h6>
					<input
						type="email"
						value={newEmail}
						onChange={(e) => setNewEmail(e.target.value)}
						required
						className="w-full p-2 mt-2 bg-transparent border rounded dark:border-gray-700 border-gray-400"
					/>
					<h6>Current Password</h6>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="w-full p-2 mt-2 bg-transparent border rounded dark:border-gray-700 border-gray-400"
					/>
					<Button type="submit" fullWidth className="mt-2" variant="filled">
						Change Email
					</Button>
				</form>
			</Card>
		</div>
	);
};

export default Settings;
