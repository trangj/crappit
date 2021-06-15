import { useQuery } from "react-query";
import { Post } from "src/types/entities/post";
import { Error } from "src/types/error";
import axios from "../../axiosConfig";

async function fetchPost(id: string) {
	try {
		const res = await axios.get(`/api/post/${id}`);
		return res.data.post;
	} catch (err) {
		throw err.response.data;
	}
}

export default function usePost(id: string) {
	return useQuery<Post, Error>(["post", id], () => fetchPost(id));
}
