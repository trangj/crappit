import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { Comment } from "src/types/entities/comment";
import { Error } from "src/types/error";
import axios from "../../axiosConfig";

export async function fetchComments(id: string, sortParam: string) {
    try {
        const res = await axios.get(`/api/comments/${id}?sort=${sortParam}`);
        return res.data.comments;
    } catch (err) {
        throw err.response.data;
    }
}

export default function useComments(id: string, sortParam: string) {
    return useQuery<Comment[], Error>(["comments", id, sortParam], () => fetchComments(id, sortParam), {
        onError: (err) => {
            toast.error(err.status.text);
        }
    });
}
