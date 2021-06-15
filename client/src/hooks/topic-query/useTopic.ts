import { useQuery } from "react-query";
import { Topic } from "src/types/entities/topic";
import { Error } from "src/types/error";
import axios from "../../axiosConfig";

interface Response {
	topic: Topic;
}

async function fetchTopic(topic: string) {
	try {
		const res = await axios.get(`/api/topic/${topic}`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useTopic(topic: string) {
	return useQuery<Response, Error>(["topic", topic], () => fetchTopic(topic));
}
