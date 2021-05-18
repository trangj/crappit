import { useMutation } from "react-query";
import axios from "../../axiosConfig";

async function addComment({ topic, postid, newComment }) {
	try {
		const res = await axios.post(
			`/api/index/t/${topic}/p/${postid}`,
			newComment
		);
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
