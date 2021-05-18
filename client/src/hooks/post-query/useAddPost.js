import { useMutation } from "react-query";
import axios from "../../axiosConfig";
import { useHistory } from "react-router-dom";

async function addPost({ topic, formData }) {
	try {
		const res = await axios.post(`/api/index/t/${topic}/p`, formData);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useAddPost() {
	const history = useHistory();
	return useMutation(addPost, {
		onSuccess: (res) => {
			const { topic, _id } = res.post;
			history.push(`/t/${topic}/p/${_id}`);
		},
	});
}
