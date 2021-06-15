import { useMutation } from "react-query";
import axios from "../../axiosConfig";
import { createStandaloneToast } from "@chakra-ui/toast";
import { Post } from "src/types/entities/post";
import { Error } from "src/types/error";

interface Response {
	vote: number,
	user_vote: number;
}

async function voting({ id, vote }: { id: number, vote: string; }) {
	try {
		const res = await axios.put(`/api/post/${id}/changevote?vote=${vote}`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}
export default function useVoting(post: Post) {
	return useMutation<Response, Error, any, any>(voting, {
		onSuccess: (res) => {
			post.vote = res.vote;
			post.user_vote = res.user_vote;
		},
		onError: (err) => {
			const toast = createStandaloneToast();
			toast({
				description: err.status.text,
				status: err.status.severity,
			});
		},
	});
}
