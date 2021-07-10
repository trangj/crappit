import { createStandaloneToast } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { Topic } from "src/types/entities/topic";
import { Error } from "src/types/error";
import axios from "../../axiosConfig";

async function fetchTopics() {
	try {
		const res = await axios.get(`/api/topics`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useTopics() {
	return useQuery<Topic[], Error>(["topics"], fetchTopics, {
		onError: (err) => {
			const toast = createStandaloneToast();
			toast({
				description: err.status.text,
				status: err.status.severity
			});
		}
	});
}
