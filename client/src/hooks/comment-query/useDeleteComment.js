import { useMutation, useQueryClient } from "react-query";
import axios from "../../axiosConfig";

async function deleteComment({ topic, postid, commentid }) {
	try {
		const res = await axios.delete(
			`/api/index/t/${topic}/p/${postid}/c/${commentid}`
		);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useDeleteComment(setOpen, comment) {
	const queryClient = useQueryClient();
	return useMutation(deleteComment, {
		onSuccess: (res) => {
			queryClient.invalidateQueries(["post", res.comment.post]);
			setOpen(false);
		},
	});
}
