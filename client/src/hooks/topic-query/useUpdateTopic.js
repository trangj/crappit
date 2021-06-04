import { createStandaloneToast } from "@chakra-ui/toast";
import { useMutation } from "react-query";
import axios from "../../axiosConfig";

async function updateTopic({ topic, formData }) {
	try {
		const res = await axios.put(`/api/topic/${topic}`, formData);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useUpdateTopic(topic) {
	return useMutation(updateTopic, {
		onSuccess: (res) => {
			topic.description = res.topic.description;
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
