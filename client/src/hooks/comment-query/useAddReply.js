import { useMutation } from "react-query";
import axios from "../../axiosConfig";

async function addReply({ commentId, reply }) {
	try {
		const res = await axios.post(`/api/comment/${commentId}/reply`, reply);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useAddReply(setOpenReply, comment) {
	return useMutation(addReply, {
		onSuccess: (res) => {
			comment.comments = [...comment.comments, res.reply];
			setOpenReply(false);
		},
	});
}
