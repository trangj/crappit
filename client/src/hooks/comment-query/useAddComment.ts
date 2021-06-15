import { useMutation } from "react-query";
import { createStandaloneToast } from "@chakra-ui/toast";
import axios from "../../axiosConfig";
import { Post } from "src/types/entities/post";
import { Comment } from "src/types/entities/comment";

async function addComment({ newComment }: { newComment: Comment; }) {
	try {
		const res = await axios.post(`/api/comment`, newComment);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useAddComment(post: Post) {
	return useMutation<any, any, any, any>(addComment, {
		onSuccess: (res) => {
			post.comments = [res.comment, ...post.comments];
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
