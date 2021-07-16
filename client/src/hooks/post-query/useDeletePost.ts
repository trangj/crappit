import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import axios from "../../axiosConfig";

async function deletePost({ postid }: { postid: number; }) {
	try {
		const res = await axios.delete(`/api/post/${postid}`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useDeletePost(topic: string) {
	const router = useRouter();
	return useMutation(deletePost, {
		onSuccess: (res) => {
			toast.success(res.status.text);
			router.push(`/t/${topic}`);
		},
		onError: (err: any) => {
			toast.error(err.status.text);
		},
	});
}
