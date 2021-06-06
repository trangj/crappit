import { useMutation } from "react-query";
import axios from "../../axiosConfig";
import { useQueryClient } from "react-query";
import { createStandaloneToast } from "@chakra-ui/toast";

async function deleteCommentModerator({ commentId }) {
	try {
		const res = await axios.delete(`/api/moderation/comment/${commentId}`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useDeleteCommentModerator(comment, setOpen) {
	const queryClient = useQueryClient();
	return useMutation(deleteCommentModerator, {
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
