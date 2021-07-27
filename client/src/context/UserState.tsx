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

	async function logoutUser() {
		try {
			await axios.post('/api/user/logout');
			delete axios.defaults.headers.authorization;
			setUser(null);
		} catch (err) {
			throw err.response.data;
		}
	}

	async function loginUser(user: any) {
		try {
			const res = await axios.post(`/api/user/login`, user);
			axios.defaults.headers.authorization = res.data.access_token;
			setUser(res.data.user);
			return res;
		} catch (err) {
			throw err.response.data;
		}
	}

	async function registerUser(user: any) {
		try {
			const res = await axios.post(`/api/user/register`, user);
			axios.defaults.headers.authorization = res.data.access_token;
			setUser(res.data.user);
			return res;
		} catch (err) {
			throw err.response.data;
		}
	}

	return (
		<UserContext.Provider
			value={{
				user: current_user,
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