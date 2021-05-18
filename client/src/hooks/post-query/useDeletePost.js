import { useMutation } from "react-query";
import { useHistory } from "react-router";
import axios from "../../axiosConfig";

async function deletePost({ topic, postid }) {
	try {
		const res = await axios.delete(`/api/index/t/${topic}/p/${postid}`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useDeletePost(post) {
	const history = useHistory();
	return useMutation(deletePost, {
		onSuccess: (res) => {
			history.push(`/t/${post.topic}`);
		},
	});
}
