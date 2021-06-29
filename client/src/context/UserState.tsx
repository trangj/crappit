import React, { createContext, useContext, useState } from "react";
import axios from "../axiosConfig";
import { User } from "src/types/entities/user";

type UserProviderProps = {
	user: User | null;
	token: string;
};

const UserContext = createContext<any>({});

export const UserProvider: React.FC<UserProviderProps> = ({ user, token, children }) => {

	const [current_user, set_current_user] = useState(user);
	const [current_token, set_current_token] = useState(token);

	axios.defaults.headers.authorization = current_token;

	async function logoutUser() {
		try {
			await axios.post('/api/user/logout');
			set_current_token("");
			set_current_user(null);
		} catch (err) {
			throw err.response.data;
		}
	}

	async function loginUser(user: any) {
		try {
			const res = await axios.post(`/api/user/login`, user);
			set_current_token(res.data.access_token);
			set_current_user(res.data.user);
		} catch (err) {
			throw err.response.data;
		}
	}

	async function registerUser(user: any) {
		try {
			const res = await axios.post(`/api/user/register`, user);
			set_current_token(res.data.access_token);
			set_current_user(res.data.user);
		} catch (err) {
			throw err.response.data;
		}
	}

	function setUser(user: User) {
		set_current_user(user);
	}

	return (
		<UserContext.Provider
			value={{
				user: current_user,
				token: current_token,
				loginUser,
				logoutUser,
				registerUser,
				setUser,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);