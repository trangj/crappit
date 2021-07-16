import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { Post } from "src/types/entities/post";
import axios from "../../axiosConfig";

async function deletePostModerator({ postid }: { postid: number; }) {
	try {
		const res = await axios.delete(`/api/moderation/post/${postid}`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useDeletePostModerator(post: Post) {
	const router = useRouter();
	return useMutation(deletePostModerator, {
		onSuccess: (res) => {
			router.push(`/t/${post.topic}`);
		},
		onSettled: (data, error) => {
			const res = data || error;
			toast(res.status.text);
		},
	});
}
