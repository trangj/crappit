import { useMutation } from "react-query";
import axios from "../../axiosConfig";
import { createStandaloneToast } from "@chakra-ui/toast";

async function voting({ id, vote }) {
	try {
		const res = await axios.put(`/api/post/${id}/changevote?vote=${vote}`);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}
export default function useVoting(post, setUser) {
	return useMutation(voting, {
		onSuccess: (res) => {
			post.vote = res.post.vote;
			setUser(res.user);
		},
		onError: (err) => {
			const toast = createStandaloneToast();
			toast({
				description: err.status.text,
				status: err.status.severity,
			});
		},
	});
}
