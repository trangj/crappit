import React, { createContext, useReducer } from "react";
import axios from "../axiosConfig";
import UserReducer from "./UserReducer";
import { loadState, saveState } from "../localStorage";

const initialState = {
	user: loadState("user"),
};

export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
	const [state, dispatch] = useReducer(UserReducer, initialState);

	function logoutUser() {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		dispatch({
			type: "LOGOUT_USER",
			payload: null,
		});
	}

	async function loginUser(user) {
		try {
			const res = await axios.post(`/api/user/login`, user);
			saveState(res.data.token, "token");
			saveState(res.data.user, "user");
			dispatch({
				type: "LOGIN_USER",
				payload: res.data,
			});
		} catch (err) {
			throw err.response.data;
		}
	}

	async function registerUser(user) {
		try {
			const res = await axios.post(`/api/user/register`, user);
			saveState(res.data.token, "token");
			saveState(res.data.user, "user");
			dispatch({
				type: "LOGIN_USER",
				payload: res.data,
			});
		} catch (err) {
			throw err.response.data;
		}
	}

	function setUser(user) {
		saveState(user, "user");
		dispatch({
			type: "SET_USER",
			payload: user,
		});
	}

	return (
		<UserContext.Provider
			value={{
				user: state.user,
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
