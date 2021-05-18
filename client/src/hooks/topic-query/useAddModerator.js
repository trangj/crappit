import { useMutation } from "react-query";
import axios from "../../axiosConfig";

async function addModerator({ topic, username }) {
	try {
		const res = await axios.post(`/api/moderation/t/${topic}`, { username });
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useAddModerator(topic) {
	return useMutation(addModerator, {
		onSuccess: (res) => {
			topic.moderators = res.topic.moderators;
		},
	});
}
