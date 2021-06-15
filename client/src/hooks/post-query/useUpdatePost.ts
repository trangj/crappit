import { createStandaloneToast } from "@chakra-ui/toast";
import { useMutation } from "react-query";
import { Post } from "src/types/entities/post";
import axios from "../../axiosConfig";

async function updatePost({ postid, newPost }: { postid: number, newPost: { content: string; }; }) {
	try {
		const res = await axios.put(`/api/post/${postid}`, newPost);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useUpdatePost(setOpenEdit: (arg0: boolean) => void, post: Post) {
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
