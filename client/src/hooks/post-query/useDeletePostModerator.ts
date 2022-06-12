import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { Post } from 'src/types/entities/post';
import axios from '../../axiosConfig';

async function deletePostModerator({ postid }: { postid: number; }) {
  try {
    const res = await axios.delete(`/api/moderation/post/${postid}`);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useDeletePostModerator(post: Post) {
  const router = useRouter();
  return useMutation(deletePostModerator, {
    onSuccess: (res) => {
      toast.success(res.status.text);
      router.push(`/t/${post.topic}`);
    },
    onError: (err: any) => {
      toast.error(err.status.text);
    },
  });
}
