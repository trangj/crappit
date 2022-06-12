import toast from 'react-hot-toast';
import { useInfiniteQuery } from 'react-query';
import { Post } from 'src/types/entities/post';
import { Error } from 'src/types/error';
import axios from '../../axiosConfig';

interface Response {
    posts: Post[],
    nextCursor: number;
}

export async function fetchProfilePosts(userid: string, pageParam: number, sortParam: string) {
  try {
    const res = await axios.get(`/api/user/${userid}/posts?skip=${!pageParam ? 0 : pageParam}&sort=${sortParam}`);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useProfilePosts(userid: string, sortParam: string) {
  return useInfiniteQuery<Response, Error>(
    ['profile', 'posts', userid, sortParam],
    ({ pageParam = 0 }) => fetchProfilePosts(userid, pageParam, sortParam),
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      onError: (err) => {
        toast.error(err.status.text);
      },
    },
  );
}
