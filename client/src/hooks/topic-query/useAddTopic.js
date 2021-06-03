import { useMutation } from "react-query";
import axios from "../../axiosConfig";
import { useHistory } from "react-router-dom";
import { createStandaloneToast } from "@chakra-ui/toast";

async function addTopic({ formData }) {
	try {
		const res = await axios.post(`/api/topic`, formData);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useAddTopic() {
	const history = useHistory();
	return useMutation(addTopic, {
		onSuccess: (res) => {
			const { title } = res.topic;
			history.push(`/t/${title}`);
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
