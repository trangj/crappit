import { useInfiniteQuery } from "react-query";
import axios from "../../axiosConfig";

async function fetchPosts(topic, pageParam, sortParam) {
	try {
		const res = await axios.get(
			`/api/posts/${topic}?skip=${pageParam}&sort=${sortParam}`
		);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function usePosts(topic, sortParam) {
	return useInfiniteQuery(
		["posts", topic, sortParam],
		({ pageParam = 0 }) => fetchPosts(topic, pageParam, sortParam),
		{
			getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
		}
	);
}
