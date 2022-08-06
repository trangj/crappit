import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { Comment } from 'src/types/entities/comment';
import { Error } from 'src/types/error';
import { Response } from 'src/types/response';
import axios from '../../axiosConfig';

interface MutateResponse extends Response {
  status: {
    text: string,
    severity: string,
  };
}

interface MutationParams {
  commentId: number
}

async function deleteComment({ commentId }: MutationParams) {
  try {
    const res = await axios.delete(`/api/comment/${commentId}`);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useDeleteComment(comment: Comment) {
  const queryClient = useQueryClient();
  return useMutation<MutateResponse, Error, MutationParams>(deleteComment, {
    onSuccess: (res) => {
      queryClient.invalidateQueries(['comments', String(comment.post_id)]);
      toast.success(res.status.text);
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
