import { createStandaloneToast } from "@chakra-ui/toast";
import { useMutation, useQueryClient } from "react-query";
import { Comment } from "src/types/entities/comment";
import axios from "../../axiosConfig";

async function deleteComment({ commentId }: { commentId: number; }) {
	try {
		const res = await axios.delete(`/api/comment/${commentId}`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useDeleteComment(comment: Comment, setOpen: (arg0: boolean) => void) {
	const queryClient = useQueryClient();
	return useMutation(deleteComment, {
		onSuccess: (res) => {
			queryClient.invalidateQueries(["post", String(comment.post_id)]);
			setOpen(false);
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
