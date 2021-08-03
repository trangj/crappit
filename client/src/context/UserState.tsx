import React, { createContext, ReactNode, useContext, useState } from "react";
import axios from "../axiosConfig";
import { User } from "src/types/entities/user";
import { AxiosResponse } from "axios";

type LoginProps = { email: string, password: string; };
type RegisterProps = { username: string, email: string, password: string, password2: string; };

type UserProviderProps = {
	user: User | null;
	logoutUser: () => Promise<void>,
	loginUser: (login: LoginProps) => Promise<AxiosResponse<any>>,
	registerUser: (register: RegisterProps) => Promise<AxiosResponse<any>>,
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserContext = createContext<UserProviderProps>({} as UserProviderProps);

export const UserProvider: React.FC<{ user: User | null, children: ReactNode; }> = ({ user, children }) => {
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

	async function loginUser(login: LoginProps) {
		try {
			const res = await axios.post(`/api/user/login`, login);
			axios.defaults.headers.authorization = res.data.access_token;
			setUser(res.data.user);
			return res;
		} catch (err) {
			throw err.response.data;
		}
	}

	async function registerUser(register: RegisterProps) {
		try {
			const res = await axios.post(`/api/user/register`, register);
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