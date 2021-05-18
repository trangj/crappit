import { useMutation } from "react-query";
import axios from "../../axiosConfig";

async function updateComment({ topic, postid, commentid, newComment }) {
	try {
		const res = await axios.put(
			`/api/index/t/${topic}/p/${postid}/c/${commentid}`,
			newComment
		);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useUpdateComment(setOpenEdit, comment) {
	return useMutation(updateComment, {
		onSuccess: (res) => {
			comment.content = res.comment.content;
			setOpenEdit(false);
		},
	});
}
