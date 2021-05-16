import React, { createContext, useReducer } from "react";
import axiosConfig from "../axiosConfig";
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
			payload: undefined,
		});
	}

	async function loginUser(user) {
		try {
			const res = await axiosConfig.post(`/api/user/login`, user);
			saveState(res.data.token, "token");
			saveState(res.data.user, "user");
			dispatch({
				type: "LOGIN_USER",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "USER_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	async function registerUser(user) {
		try {
			const res = await axiosConfig.post(`/api/user/register`, user);
			saveState(res.data.token, "token");
			saveState(res.data.user, "user");
			dispatch({
				type: "LOGIN_USER",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "USER_ERROR",
				payload: err.response.data.status,
			});
		}
	}

	return (
		<UserContext.Provider
			value={{
				user: state.user,
				loginUser,
				logoutUser,
				registerUser,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
