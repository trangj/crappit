import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { Comment } from 'src/types/entities/comment';
import axios from '../../axiosConfig';

async function deleteCommentModerator({ commentId, topic }: { commentId: number, topic: string }) {
  try {
    const res = await axios.delete(`/api/moderation/${topic}/comment/${commentId}`);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useDeleteCommentModerator(
  comment: Comment,
  setOpen: (arg0: boolean) => void,
) {
  const queryClient = useQueryClient();
  return useMutation(deleteCommentModerator, {
    onSuccess: (res) => {
      queryClient.invalidateQueries(['comments', String(comment.post_id)]);
      toast.success(res.status.text);
      setOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.status.text);
    },
  });
}
