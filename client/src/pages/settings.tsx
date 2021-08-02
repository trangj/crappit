import React, { FormEventHandler, useRef, useState } from "react";
import toast from 'react-hot-toast';
import { useUser } from "../context/UserState";
import axios from "../axiosConfig";
import { Button, Card, Container, Divider } from "../ui";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Dialog } from "@headlessui/react";

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
	const router = useRouter();
	const { user, setUser } = useUser();
	const [newEmail, setNewEmail] = useState("");
	const [password, setPassword] = useState("");
	const [open, setOpen] = useState(false);
	const cancelRef = useRef(null);

	if (!user) {
		router.push('/login');
		return null;
	};

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
			setOpen(false);
			toast.success(res.data.status.text);
		} catch (err) {
			toast.error(err.response.data.status.text);
		}
	};

	const handleAvatar = async (e: any) => {
		try {
			const file = e.target.files[0];
			if (file.type !== 'image/png' && file.type !== 'image/jpg' && file.type !== 'image/jpeg') throw Error("Invalid file type");
			const formData = new FormData();
			formData.append('file', file);
			const res = await axios.post(`/api/user/${user.id}/avatar`, formData);
			setUser({ ...user, ...res.data.user });
			toast.success(res.data.status.text);
		} catch (err) {
			toast.error(err.message);
		}
	};

	return (
		<Container>
			<Head>
				<title>Crappit Settings</title>
			</Head>
			<Card className="p-3">
				<div className="w-1/2 flex flex-col gap-3">
					<h6>Account Settings</h6>
					<Divider className="my-1" />
					<div className="flex items-center">
						<div>
							<div className="font-medium">Change password</div>
							<small className="text-gray-500 dark:text-gray-400">Password must be 6 characters long</small>
						</div>
						<Button onClick={() => handlePassword(user.email)} className="ml-auto">
							Change
						</Button>
					</div>
					<div className="flex items-center">
						<div>
							<div className="font-medium">Email address</div>
							<small className="text-gray-500 dark:text-gray-400">{user.email}</small>
						</div>
						<Button onClick={() => setOpen(true)} className="ml-auto">
							Change
						</Button>
						<Dialog
							as="div"
							className="fixed inset-0 z-10 overflow-y-auto"
							open={open}
							onClose={() => setOpen(false)}
							initialFocus={cancelRef}
						>
							<Dialog.Overlay className="fixed inset-0 bg-black opacity-30 z-50" />
							<div className="flex items-center justify-center min-h-screen">
								<div className="bg-white dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-700 max-w-sm mx-auto z-50 p-6 gap-3 flex flex-col">
									<Dialog.Title as="h6">
										Update your email
									</Dialog.Title>
									<Dialog.Description>
										Update your email below. There will be a new verification email sent that you will need to use to verify this new email.
									</Dialog.Description>
									<form onSubmit={handleEmail}>
										<div>Current Password</div>
										<input
											type="password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
											className="w-full p-2 mt-2 bg-transparent border rounded dark:border-gray-700 border-gray-400"
										/>
										<div>New Email</div>
										<input
											type="email"
											value={newEmail}
											onChange={(e) => setNewEmail(e.target.value)}
											required
											className="w-full p-2 mt-2 bg-transparent border rounded dark:border-gray-700 border-gray-400"
										/>
										<Button type="submit" className="mt-3 ml-auto" variant="filled">
											Save Email
										</Button>
									</form>
								</div>
							</div>
						</Dialog>
					</div>
					<h6>Customize Profile</h6>
					<Divider className="my-1" />
					<div className="font-medium">Avatar image</div>
					<input type="file" accept=".png,.jpg,.jpeg" onChange={handleAvatar} />
					<small className="text-gray-500 dark:text-gray-400">Images must be in .png or .jpg format</small>
				</div>
			</Card>
		</Container>
	);
};

export default Settings;
