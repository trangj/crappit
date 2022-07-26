import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { Post } from 'src/types/entities/post';
import axios from '../../axiosConfig';

async function updatePost({ postid, newPost }: { postid: number, newPost: { content: string; }; }) {
  try {
    const res = await axios.put(`/api/post/${postid}`, newPost);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useUpdatePost(post: Post) {
  const queryClient = useQueryClient();
  return useMutation(updatePost, {
    onSuccess: (res) => {
      queryClient.setQueryData(['post', String(post.id)], (initialData: any) => {
        initialData.content = res.post.content;
        return initialData;
      });
      toast.success(res.status.text);
    },
    onError: (err: any) => {
      toast.error(err.status.text);
    },
  });
}
