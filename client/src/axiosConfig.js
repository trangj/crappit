import axios from "axios";
import { loadState } from "./localStorage";

const instance = axios.create({
	baseURL: process.env.REACT_APP_SERVER_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

instance.interceptors.request.use((config) => {
	config.headers.Authorization = loadState("token");
	return config;
});

export default instance;
