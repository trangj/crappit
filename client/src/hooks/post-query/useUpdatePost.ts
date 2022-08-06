import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { Post } from 'src/types/entities/post';
import { Error } from 'src/types/error';
import { Response } from 'src/types/response';
import axios from '../../axiosConfig';

interface MutationResponse extends Response {
  post: {
    content: string,
  };
}

interface MutationParams {
  postid: number
  newPost: {
    content: string
  }
}

async function updatePost({ postid, newPost }: MutationParams) {
  try {
    const res = await axios.put(`/api/post/${postid}`, newPost);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useUpdatePost(post: Post) {
  const queryClient = useQueryClient();
  return useMutation<MutationResponse, Error, MutationParams>(updatePost, {
    onSuccess: (res) => {
      queryClient.setQueryData(['post', String(post.id)], (initialData: any) => {
        initialData.content = res.post.content;
        return initialData;
      });
      toast.success(res.status.text);
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
