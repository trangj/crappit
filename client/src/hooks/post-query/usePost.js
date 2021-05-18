import { useQuery } from "react-query";
import axios from "../../axiosConfig";

async function fetchPost(topic, id) {
	try {
		const res = await axios.get(`/api/index/t/${topic}/p/${id}`);
		return res.data.post;
	} catch (err) {
		throw err.response.data;
	}
}

export default function usePost(topic, id) {
	return useQuery(["post", id], () => fetchPost(topic, id));
}
