import { createStandaloneToast } from "@chakra-ui/react";
import { useInfiniteQuery } from "react-query";
import { Post } from "src/types/entities/post";
import { Error } from "src/types/error";
import axios from "../../axiosConfig";

interface Response {
	posts: Post[],
	nextCursor: number;
}

export async function fetchPosts(topic: string, pageParam: number, sortParam: string) {
	try {
		const res = await axios.get(
			`/api/posts/${topic}?skip=${!pageParam ? 0 : pageParam}&sort=${sortParam}`
		);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function usePosts(topic: string, sortParam: string) {
	return useInfiniteQuery<Response, Error>(
		["posts", topic, sortParam],
		({ pageParam = 0 }) => fetchPosts(topic, pageParam, sortParam),
		{
			getNextPageParam: (lastPage, allPages) => lastPage.nextCursor,
			onError: (err) => {
				const toast = createStandaloneToast();
				toast({
					description: err.status.text,
					status: err.status.severity
				});
			}
		}
	);
}
