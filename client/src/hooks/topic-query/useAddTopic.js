import { useMutation } from "react-query";
import axios from "../../axiosConfig";
import { useHistory } from "react-router-dom";

async function addTopic({ formData }) {
	try {
		const res = await axios.post(`/api/index/t`, formData);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useAddTopic(setUser) {
	const history = useHistory();
	return useMutation(addTopic, {
		onSuccess: (res) => {
			const { title } = res.topic;
			setUser(res.user);
			history.push(`/t/${title}`);
		},
	});
}
