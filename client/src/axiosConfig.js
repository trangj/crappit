import axios from "axios";

const instance = axios.create({
	baseURL: process.env.SERVER_URL || "http://localhost:5000",
	headers: {
		"Content-Type": "application/json",
		"x-auth-token": localStorage.token,
	},
});

export default instance;
