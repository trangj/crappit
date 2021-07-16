import toast from 'react-hot-toast';
import { useQuery } from "react-query";
import { Topic } from "src/types/entities/topic";
import { Error } from "src/types/error";
import axios from "../../axiosConfig";

async function fetchTopics() {
	try {
		const res = await axios.get(`/api/topics`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useTopics() {
	return useQuery<Topic[], Error>(["topics"], fetchTopics, {
		onError: (err) => {
			toast(err.status.text);
		}
	});
}
