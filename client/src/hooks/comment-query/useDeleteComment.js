import { useMutation, useQueryClient } from "react-query";
import axios from "../../axiosConfig";

async function deleteCommentModerator({ commentId }) {
	try {
		const res = await axios.delete(`/api/moderation/${commentId}`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useDeleteCommentModerator(setOpen) {
	const queryClient = useQueryClient();
	return useMutation(deleteCommentModerator, {
		onSuccess: (res) => {
			queryClient.invalidateQueries(["post", res.comment.postId]);
			setOpen(false);
		},
	});
}
