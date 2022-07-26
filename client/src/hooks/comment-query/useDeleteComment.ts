import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { Comment } from 'src/types/entities/comment';
import axios from '../../axiosConfig';

async function deleteComment({ commentId }: { commentId: number; }) {
  try {
    const res = await axios.delete(`/api/comment/${commentId}`);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useDeleteComment(comment: Comment) {
  const queryClient = useQueryClient();
  return useMutation(deleteComment, {
    onSuccess: (res) => {
      queryClient.invalidateQueries(['comments', String(comment.post_id)]);
      toast.success(res.status.text);
    },
    onError: (err: any) => {
      toast.error(err.status.text);
    },
  });
}
