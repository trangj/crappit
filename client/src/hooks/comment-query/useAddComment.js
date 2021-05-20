import { useMutation } from "react-query";
import axios from "../../axiosConfig";

async function addComment({ newComment }) {
	try {
		const res = await axios.post(`/api/comment`, newComment);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useAddComment(post) {
	return useMutation(addComment, {
		onSuccess: (res) => {
			post.comments = [...post.comments, res.comment];
		},
	});
}
