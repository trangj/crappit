import { createStandaloneToast } from "@chakra-ui/toast";
import { useMutation } from "react-query";
import axios from "../../axiosConfig";

async function updateComment({ commentId, newComment }) {
	try {
		const res = await axios.put(`/api/comment/${commentId}`, newComment);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useUpdateComment(setOpenEdit, comment) {
	return useMutation(updateComment, {
		onSuccess: (res) => {
			comment.content = res.comment.content;
			comment.is_edited = true;
			setOpenEdit(false);
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
