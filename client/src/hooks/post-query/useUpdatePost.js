import { createStandaloneToast } from "@chakra-ui/toast";
import { useMutation } from "react-query";
import axios from "../../axiosConfig";

async function updatePost({ postid, newPost }) {
	try {
		const res = await axios.put(`/api/post/${postid}`, newPost);
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
