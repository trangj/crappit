import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { Post } from 'src/types/entities/post';
import { Error } from 'src/types/error';
import axios from '../../axiosConfig';

interface Response {
  vote: number,
  user_vote: number;
}

async function voting({ id, vote }: { id: number, vote: string; }) {
  try {
    const res = await axios.put(`/api/post/${id}/changevote?vote=${vote}`);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}
export default function useVoting(post: Post) {
  return useMutation<Response, Error, any, any>(voting, {
    onSuccess: (res) => {
      post.vote = res.vote;
      post.user_vote = res.user_vote;
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
