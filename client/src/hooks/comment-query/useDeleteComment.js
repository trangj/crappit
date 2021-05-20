import { useMutation, useQueryClient } from "react-query";
import axios from "../../axiosConfig";

async function deleteComment({ commentId }) {
	try {
		const res = await axios.delete(`/api/comment/${commentId}`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useDeleteComment(setOpen) {
	const queryClient = useQueryClient();
	return useMutation(deleteComment, {
		onSuccess: (res) => {
			queryClient.invalidateQueries(["post", res.comment.postId]);
			setOpen(false);
		},
	});
}
