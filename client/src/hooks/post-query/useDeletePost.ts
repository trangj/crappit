import { createStandaloneToast } from "@chakra-ui/toast";
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
			router.push(`/t/${topic}`);
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
