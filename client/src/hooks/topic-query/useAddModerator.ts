import toast from "react-hot-toast";
import { useMutation } from "react-query";
import axios from "../../axiosConfig";

async function addModerator({ topic, username }: { topic: string, username: string; }) {
	try {
		const res = await axios.post(`/api/moderation/topic/${topic}`, {
			username,
		});
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useAddModerator() {
	return useMutation(addModerator, {
		onSuccess: (res) => {
			toast.success(res.status.text);
		},
		onError: (err: any) => {
			toast.error(err.status.text);
		},
	});
}
