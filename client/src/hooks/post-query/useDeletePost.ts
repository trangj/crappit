import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import { Response } from 'src/types/response';
import { Error } from 'src/types/error';
import axios from '../../axiosConfig';

interface MutationParams {
  postid: number
}

async function deletePost({ postid }: MutationParams) {
  try {
    const res = await axios.delete(`/api/post/${postid}`);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useDeletePost(topic: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation<Response, Error, MutationParams>(deletePost, {
    onSuccess: (res) => {
      queryClient.invalidateQueries(['posts', topic]);
      toast.success(res.status.text);
      router.push(`/t/${topic}`);
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
