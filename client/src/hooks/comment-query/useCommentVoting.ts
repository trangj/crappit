import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { Comment } from 'src/types/entities/comment';
import { Error } from 'src/types/error';
import { Response } from 'src/types/response';
import axios from '../../axiosConfig';

interface MutateResponse extends Response {
  vote: number;
  user_vote: number;
}

interface MutationParams {
  commentId: number,
  vote: string
}

async function commentVoting({ commentId, vote }: MutationParams) {
  try {
    const res = await axios.put(
      `/api/comment/${commentId}/changevote?vote=${vote}`,
    );
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useCommentVoting(comment: Comment) {
  return useMutation<MutateResponse, Error, MutationParams>(commentVoting, {
    onSuccess: (res) => {
      comment.vote = res.vote;
      comment.user_vote = res.user_vote;
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
