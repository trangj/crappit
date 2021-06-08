import React, { useContext, useState } from "react";
import {
	Button,
	Heading,
	Text,
	Divider,
	FormControl,
	FormLabel,
	Input,
	Container,
} from "@chakra-ui/react";
import { UserContext } from "../../context/UserState";
import axios from "../../axiosConfig";
import AlertStatus from "../Utils/AlertStatus";
import Card from "../Utils/Card";

const Settings = () => {
	const { user, setUser } = useContext(UserContext);
	const [status, setStatus] = useState(undefined);
	const [newEmail, setNewEmail] = useState("");
	const [password, setPassword] = useState("");

	const handlePassword = async (email) => {
		try {
			const res = await axios.post(`/api/user/forgot`, { email });
			setStatus(res.data);
		} catch (err) {
			setStatus(err.response.data);
		}
	};

	const handleEmail = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post("/api/user/email", { newEmail, password });
			setUser({ ...user, email: res.data.user.email });
			setStatus(res.data);
		} catch (err) {
			setStatus(err.response.data);
		}
	};

	return (
		<Container>
			<Card>
				<Heading>Settings</Heading>
				<Divider my="3" />
				{status !== undefined && <AlertStatus status={status} />}
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
	);
};

export default Settings;
