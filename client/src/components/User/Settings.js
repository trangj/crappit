import React, { useContext, useState } from "react";
import { Button, Heading, Text, Divider } from "@chakra-ui/react";
import { UserContext } from "../../context/UserState";
import axios from "../../axiosConfig";
import AlertStatus from "../Utils/AlertStatus";
import Card from "../Utils/Card";

const Settings = () => {
	const { user } = useContext(UserContext);
	const [status, setStatus] = useState(undefined);

	const handleSubmit = async (email) => {
		try {
			const res = await axios.post(`/api/user/forgot`, { email });
			setStatus(res.data);
		} catch (err) {
			setStatus(err.response.data);
		}
	};

	return (
		<Card>
			<Heading>Settings</Heading>
			<Divider my="3" />
			<Text mb="2">Forgot your password?</Text>
			<Button onClick={() => handleSubmit(user.email)}>
				Request Password Change
			</Button>
			{status !== undefined && <AlertStatus status={status} />}
		</Card>
	);
};

export default Settings;
