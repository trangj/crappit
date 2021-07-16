import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { Topic } from "src/types/entities/topic";
import axios from "../../axiosConfig";

async function updateTopic({ topic, formData }: { topic: string, formData: FormData; }) {
	try {
		const res = await axios.put(`/api/topic/${topic}`, formData);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useUpdateTopic(topic: Topic) {
	return useMutation(updateTopic, {
		onSuccess: (res) => {
			topic.description = res.topic.description;
			topic.image_url = res.topic.image_url;
			topic.image_name = res.topic.image_name;
			toast.success(res.status.text);
		},
		onError: (err: any) => {
			toast.error(err.status.text);
		},
	});
}
