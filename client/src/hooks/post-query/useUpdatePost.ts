import toast from "react-hot-toast";
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
			toast.success(res.status.text);
			setOpenEdit(false);
		},
		onError: (err: any) => {
			toast.error(err.status.text);
		},
	});
}
