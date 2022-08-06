import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { Comment } from 'src/types/entities/comment';
import { Error } from 'src/types/error';
import { Response } from 'src/types/response';
import axios from '../../axiosConfig';

interface MutationParams {
  commentId: number
  topic: string
}

async function deleteCommentModerator({ commentId, topic }: MutationParams) {
  try {
    const res = await axios.delete(`/api/moderation/${topic}/comment/${commentId}`);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useDeleteCommentModerator(comment: Comment) {
  const queryClient = useQueryClient();
  return useMutation<Response, Error, MutationParams>(deleteCommentModerator, {
    onSuccess: (res) => {
      queryClient.invalidateQueries(['comments', String(comment.post_id)]);
      toast.success(res.status.text);
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
