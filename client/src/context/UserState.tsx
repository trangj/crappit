import React, { createContext, useContext, useState } from "react";
import axios from "../axiosConfig";
import { User } from "src/types/entities/user";

type UserProviderProps = {
	user: User | null;
	token: string;
};

const UserContext = createContext<any>({});

export const UserProvider: React.FC<UserProviderProps> = ({ user, token, children }) => {
	const [current_user, setUser] = useState(user);
	const [current_token, setToken] = useState(token);

	if (current_token && !axios.defaults.headers.authorization && axios.defaults.headers.authorization !== current_token) {
		setToken(axios.defaults.headers.authorization);
		axios.defaults.headers.authorization = current_token;
	}

	async function logoutUser() {
		try {
			await axios.post('/api/user/logout');
			setToken("");
			setUser(null);
		} catch (err) {
			throw err.response.data;
		}
	}

	async function loginUser(user: any) {
		try {
			const res = await axios.post(`/api/user/login`, user);
			setToken(res.data.access_token);
			setUser(res.data.user);
		} catch (err) {
			throw err.response.data;
		}
	}

	async function registerUser(user: any) {
		try {
			const res = await axios.post(`/api/user/register`, user);
			setToken(res.data.access_token);
			setUser(res.data.user);
		} catch (err) {
			throw err.response.data;
		}
	}

	return (
		<UserContext.Provider
			value={{
				user: current_user,
				token: current_token,
				loginUser,
				logoutUser,
				registerUser,
				setToken,
				setUser,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);