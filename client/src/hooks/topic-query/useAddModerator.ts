import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { Topic } from "src/types/entities/topic";
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

export default function useAddModerator(topic: Topic) {
	const queryClient = useQueryClient();
	return useMutation(addModerator, {
		onSuccess: (res) => {
			console.log(res);
			queryClient.setQueryData(["topic", topic.title], (initialData: any) => {
				initialData.moderators.push(res.user);
				return initialData;
			});
			toast.success(res.status.text);
		},
		onError: (err: any) => {
			toast.error(err.status.text);
		},
	});
}
