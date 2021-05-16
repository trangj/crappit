import axios from "axios";
import { loadState } from "./localStorage";

const instance = axios.create({
	baseURL: process.env.REACT_APP_SERVER_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

instance.interceptors.request.use((config) => {
	const token = loadState("token");
	config.headers["x-auth-token"] = token ? token : undefined;
	return config;
});

export default instance;
