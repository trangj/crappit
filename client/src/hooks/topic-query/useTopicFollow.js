import { useMutation } from "react-query";
import axios from "../../axiosConfig";

async function followTopic(topic) {
	try {
		const res = await axios.post(`/api/index/t/${topic}/followtopic`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useTopicsFollow(setUser) {
	return useMutation(followTopic, {
		onSuccess: (res) => {
			setUser(res.user);
		},
	});
}
