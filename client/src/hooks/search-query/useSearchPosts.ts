import toast from 'react-hot-toast';
import { useInfiniteQuery } from 'react-query';
import { Post } from 'src/types/entities/post';
import { Error } from 'src/types/error';
import axios from '../../axiosConfig';

interface Response {
  posts: Post[],
  nextCursor: number;
}

export async function fetchSearchPosts(q: string, pageParam: number, sortParam: string) {
  try {
    const res = await axios.get(`/api/search?q=${q}&skip=${!pageParam ? 0 : pageParam}&sort=${sortParam}`);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useSearchPosts(q: string, sortParam: string) {
  return useInfiniteQuery<Response, Error>(
    ['search', q, 'posts', sortParam],
    ({ pageParam = 0 }) => fetchSearchPosts(q, pageParam, sortParam),
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      onError: (err) => {
        toast.error(err.status.text);
      },
    },
  );
}
