import { createStandaloneToast } from "@chakra-ui/toast";
import { useMutation } from "react-query";
import { useHistory } from "react-router";
import { Post } from "src/types/entities/post";
import axios from "../../axiosConfig";

async function deletePostModerator({ postid }: { postid: number; }) {
	try {
		const res = await axios.delete(`/api/moderation/post/${postid}`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useDeletePostModerator(post: Post) {
	const history = useHistory();
	return useMutation(deletePostModerator, {
		onSuccess: (res) => {
			history.push(`/t/${post.topic}`);
		},
		onSettled: (data, error) => {
			const res = data || error;
			const toast = createStandaloneToast();
			toast({
				description: res.status.text,
				status: res.status.severity,
			});
		},
	});
}
