import { useMutation } from "react-query";
import axios from "../../axiosConfig";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

async function addTopic({ formData }: { formData: FormData; }) {
	try {
		const res = await axios.post(`/api/topic`, formData);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useAddTopic() {
	const router = useRouter();
	return useMutation(addTopic, {
		onSuccess: (res) => {
			const { title } = res.topic;
			toast.success(res.status.text);
			router.push(`/t/${title}`);
		},
		onError: (err: any) => {
			toast.error(err.status.text);
		},
	});
}
