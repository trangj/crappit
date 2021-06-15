import { useMutation } from "react-query";
import axios from "../../axiosConfig";
import { createStandaloneToast } from "@chakra-ui/toast";
import { Comment } from "src/types/entities/comment";
import { Error } from "src/types/error";

interface Response {
	comment: Comment;
}

async function addReply({ commentId, reply }: { commentId: number, reply: Comment; }) {
	try {
		const res = await axios.post(`/api/comment/${commentId}/reply`, reply);
		return res.data;
	} catch (err) {
		throw err.response.data;
	}
}

export default function useAddReply(setOpenReply: (arg0: boolean) => void, comment: Comment) {
	return useMutation<Response, Error, any, any>(addReply, {
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
