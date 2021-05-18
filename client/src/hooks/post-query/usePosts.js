import { useInfiniteQuery } from "react-query";
import axios from "../../axiosConfig";

async function fetchPosts(topic, pageParam) {
	try {
		const res =
			topic !== ""
				? await axios.get(`/api/index/t/${topic}?skip=${pageParam}`)
				: await axios.get(`/api/index?skip=${pageParam}`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function usePosts(topic) {
	return useInfiniteQuery(
		["posts", topic],
		({ pageParam = 0 }) => fetchPosts(topic, pageParam),
		{
			getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
		}
	);
}
