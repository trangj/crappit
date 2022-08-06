import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { Comment } from 'src/types/entities/comment';
import { Error } from 'src/types/error';
import { Response } from 'src/types/response';
import axios from '../../axiosConfig';

interface MutationResponse extends Response {
  comment: {
    content: string,
    updated_at: Date,
  };
}

interface MutationParams {
  commentId: number
  newComment: {
    content: string
  }
}

async function updateComment({ commentId, newComment }: MutationParams) {
  try {
    const res = await axios.put(`/api/comment/${commentId}`, newComment);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useUpdateComment(comment: Comment) {
  return useMutation<MutationResponse, Error, MutationParams>(updateComment, {
    onSuccess: (res) => {
      comment.content = res.comment.content;
      comment.updated_at = res.comment.updated_at;
      comment.is_edited = true;
      toast.success(res.status.text);
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
