import { useQuery } from "react-query";
import axios from "../../axiosConfig";

async function fetchTopics() {
	try {
		const res = await axios.get(`/api/index/t`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useTopics() {
	return useQuery(["topics"], fetchTopics);
}
