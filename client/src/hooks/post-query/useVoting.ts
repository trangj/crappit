import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { Post } from 'src/types/entities/post';
import { Error } from 'src/types/error';
import { Response } from 'src/types/response';
import axios from '../../axiosConfig';

interface MutationResponse extends Response {
  vote: number,
  user_vote: number;
}

interface MutationParams {
  id: number
  vote: string
}

async function voting({ id, vote }: MutationParams) {
  try {
    const res = await axios.put(`/api/post/${id}/changevote?vote=${vote}`);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}
export default function useVoting(post: Post) {
  return useMutation<MutationResponse, Error, MutationParams>(voting, {
    onSuccess: (res) => {
      post.vote = res.vote;
      post.user_vote = res.user_vote;
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
