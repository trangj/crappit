import { useMutation } from "react-query";
import axios from "../../axiosConfig";
import { createStandaloneToast } from "@chakra-ui/toast";

async function addReply({ commentId, reply }) {
	try {
		const res = await axios.post(`/api/comment/${commentId}/reply`, reply);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useAddReply(setOpenReply, comment) {
	return useMutation(addReply, {
		onSuccess: (res) => {
			comment.children = [res.comment, ...comment.children];
			setOpenReply(false);
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
