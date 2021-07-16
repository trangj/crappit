import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { Topic } from "src/types/entities/topic";
import axios from "../../axiosConfig";

async function followTopic(topic: string) {
	try {
		const res = await axios.post(`/api/topic/${topic}/followtopic`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useAddTopicFollow(topic: Topic) {
	const queryClient = useQueryClient();
	return useMutation<any, any, any, any>(followTopic, {
		onSuccess: (res) => {
			topic.user_followed_id = res.user_followed_id;
			toast.success(res.status.text);
			queryClient.invalidateQueries(["followed_topics"]);
		},
		onError: (err: any) => {
			toast.error(err.status.text);
		},
	});
}
