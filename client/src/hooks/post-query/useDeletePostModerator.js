import { useMutation } from "react-query";
import { useHistory } from "react-router";
import axios from "../../axiosConfig";

async function deletePostModerator({ postid }) {
	try {
		const res = await axios.delete(`/api/moderation/post/${postid}`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useDeletePostModerator(post) {
	const history = useHistory();
	return useMutation(deletePostModerator, {
		onSuccess: (res) => {
			history.push(`/t/${post.topic}`);
		},
	});
}
