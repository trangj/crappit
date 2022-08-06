import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import { Post } from 'src/types/entities/post';
import { Response } from 'src/types/response';
import { Error } from 'src/types/error';
import axios from '../../axiosConfig';

interface MutationParams {
  postid: number
  topic: string
}

async function deletePostModerator({ postid, topic }: MutationParams) {
  try {
    const res = await axios.delete(`/api/moderation/${topic}/post/${postid}`);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useDeletePostModerator(post: Post) {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation<Response, Error, MutationParams>(deletePostModerator, {
    onSuccess: (res) => {
      queryClient.invalidateQueries(['posts', post.topic]);
      toast.success(res.status.text);
      router.push(`/t/${post.topic}`);
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
