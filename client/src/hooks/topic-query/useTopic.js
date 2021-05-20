import { useQuery } from "react-query";
import axios from "../../axiosConfig";

async function fetchTopic(topic) {
	try {
		const res = await axios.get(`/api/topic/${topic}`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useTopic(topic) {
	return useQuery(["topic", topic], () => fetchTopic(topic));
}
