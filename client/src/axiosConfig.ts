import axios from "axios";
import jwt_decode from 'jwt-decode';

const instance = axios.create({
	baseURL: process.env.REACT_APP_SERVER_URL || 'http://localhost:5000',
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true
});

instance.interceptors.request.use(async config => {
	if (config.headers.authorization) {
		const decode: any = jwt_decode(config.headers.authorization);
		if (Date.now() >= decode.exp * 1000) {
			const res = await axios.post('http://localhost:5000/api/user/refresh_token', {}, { withCredentials: true });
			instance.defaults.headers.authorization = res.data.access_token;
		}
	}
	return config;
});

export default instance;
