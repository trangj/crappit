import axios from "axios";

const instance = axios.create({
	baseURL: process.env.REACT_APP_SERVER_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

instance.interceptors.request.use((config) => {
	config.headers["x-auth-token"] = localStorage.token;
	return config;
});

export default instance;
