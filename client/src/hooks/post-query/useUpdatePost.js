import { useMutation } from "react-query";
import axios from "../../axiosConfig";

async function updatePost({ topic, postid, newPost }) {
	try {
		const res = await axios.put(`/api/index/t/${topic}/p/${postid}`, newPost);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useUpdatePost(setOpenEdit, post) {
	return useMutation(updatePost, {
		onSuccess: (res) => {
			post.content = res.post.content;
			setOpenEdit(false);
		},
	});
}
