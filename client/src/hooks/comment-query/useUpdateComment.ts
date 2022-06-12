import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { Comment } from 'src/types/entities/comment';
import axios from '../../axiosConfig';

async function updateComment(
  { commentId, newComment }: { commentId: number, newComment: { content: string; }; },
) {
  try {
    const res = await axios.put(`/api/comment/${commentId}`, newComment);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useUpdateComment(setOpenEdit: (arg0: boolean) => void, comment: Comment) {
  return useMutation(updateComment, {
    onSuccess: (res) => {
      comment.content = res.comment.content;
      comment.updated_at = res.comment.updated_at;
      comment.is_edited = true;
      toast.success(res.status.text);
      setOpenEdit(false);
    },
    onError: (err: any) => {
      toast.error(err.status.text);
    },
  });
}
