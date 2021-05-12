import axios from "axios";

const instance = axios.create({
	baseURL: process.env.REACT_APP_SERVER_URL,
	headers: {
		"Content-Type": "application/json",
		"x-auth-token": localStorage.token,
	},
});

export default instance;
