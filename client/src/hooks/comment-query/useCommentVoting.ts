import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { Comment } from 'src/types/entities/comment';
import { Error } from 'src/types/error';
import axios from '../../axiosConfig';

interface Response {
  vote: number;
  user_vote: number;
}

async function commentVoting({ commentId, vote }: { commentId: number, vote: string; }) {
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
  return useMutation<Response, Error, any, any>(commentVoting, {
    onSuccess: (res) => {
      comment.vote = res.vote;
      comment.user_vote = res.user_vote;
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
