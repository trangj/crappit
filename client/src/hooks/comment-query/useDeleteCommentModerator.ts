import { useMutation } from "react-query";
import axios from "../../axiosConfig";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { Comment } from "src/types/entities/comment";

async function deleteCommentModerator({ commentId }: { commentId: number; }) {
	try {
		const res = await axios.delete(`/api/moderation/comment/${commentId}`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useDeleteCommentModerator(comment: Comment, setOpen: (arg0: boolean) => void) {
	const queryClient = useQueryClient();
	return useMutation(deleteCommentModerator, {
		onSuccess: (res) => {
			queryClient.invalidateQueries(["post", String(comment.post_id)]);
			toast.success(res.status.text);
			setOpen(false);
		},
		onError: (err: any) => {
			toast.error(err.status.text);
		},
	});
}
