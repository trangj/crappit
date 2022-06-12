import toast from 'react-hot-toast';
import { useQuery } from 'react-query';
import { Post } from 'src/types/entities/post';
import { Error } from 'src/types/error';
import axios from '../../axiosConfig';

export async function fetchPost(id: string) {
  try {
    const res = await axios.get(`/api/post/${id}`);
    return res.data.post;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function usePost(id: string) {
  return useQuery<Post, Error>(['post', id], () => fetchPost(id), {
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
