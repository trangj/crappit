import axios from "axios";

const instance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true
});

instance.interceptors.response.use(response => response,
	async error => {
		const originalRequest = error.config;
		if (error.response.status === 403 && !originalRequest._retry) {
			originalRequest._retry = true;
			const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}api/user/refresh_token`, {}, { withCredentials: true });
			instance.defaults.headers.authorization = res.data.access_token;
			originalRequest.headers.authorization = res.data.access_token;
			return instance(originalRequest);
		}
		return Promise.reject(error);
	}
);

export default instance;
