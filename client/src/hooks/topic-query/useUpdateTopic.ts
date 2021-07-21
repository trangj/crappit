import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { Topic } from "src/types/entities/topic";
import axios from "../../axiosConfig";

async function updateTopic({ topic, newTopic }: { topic: string, newTopic: { description: string, headline: string; }; }) {
	try {
		const res = await axios.put(`/api/topic/${topic}`, newTopic);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useUpdateTopic(topic: Topic) {
	const queryClient = useQueryClient();
	return useMutation(updateTopic, {
		onSuccess: (res) => {
			queryClient.setQueryData(["topic", topic.title], (initalData: any) => {
				initalData.description = res.topic.description;
				initalData.headline = res.topic.headline;
				return initalData;
			});
			toast.success(res.status.text);
		},
		onError: (err: any) => {
			toast.error(err.status.text);
		},
	});
}
