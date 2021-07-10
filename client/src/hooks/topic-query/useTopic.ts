import { useQuery } from "react-query";
import { Topic } from "src/types/entities/topic";
import { Error } from "src/types/error";
import axios from "../../axiosConfig";

export async function fetchTopic(topic: string) {
	try {
		const res = await axios.get(`/api/topic/${topic}`);
		return res.data.topic;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useTopic(topic: string) {
	return useQuery<Topic, Error>(["topic", topic], () => fetchTopic(topic));
}
