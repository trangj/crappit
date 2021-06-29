import { useMutation } from "react-query";
import axios from "../../axiosConfig";
import { createStandaloneToast } from "@chakra-ui/toast";
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
			router.push(`/t/${title}`);
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
