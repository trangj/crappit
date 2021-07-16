import { useMutation } from "react-query";
import axios from "../../axiosConfig";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

async function addPost({ formData }: { formData: FormData; }) {
	try {
		const res = await axios.post(`/api/post`, formData);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useAddPost() {
	const router = useRouter();
	return useMutation(addPost, {
		onSuccess: (res) => {
			const { topic, id } = res.post;
			router.push(`/t/${topic}/comments/${id}`);
		},
		onSettled: (data, error) => {
			const res = data || error;
			toast(res.status.text);
		},
	});
}
