import { useQuery } from "react-query";
import axios from "../../axiosConfig";

async function fetchPost(id) {
	try {
		const res = await axios.get(`/api/post/${id}`);
		return res.data.post;
	} catch (err) {
		throw err.response.data;
	}
}

export default function usePost(id) {
	return useQuery(["post", id], () => fetchPost(id));
}
