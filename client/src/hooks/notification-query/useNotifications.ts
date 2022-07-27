import toast from 'react-hot-toast';
import { useInfiniteQuery } from 'react-query';
import { Notification } from 'src/types/entities/notification';
import { Error } from 'src/types/error';
import axios from '../../axiosConfig';

interface Response {
  notifications: Notification[],
  nextCursor: number;
}

export async function fetchNotifications(pageParam: number) {
  try {
    const res = await axios.get(
      `/api/notification/?skip=${!pageParam ? 0 : pageParam}`,
    );
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useNotifications() {
  return useInfiniteQuery<Response, Error>(
    ['notifications'],
    ({ pageParam = 0 }) => fetchNotifications(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      onError: (err) => {
        toast.error(err.status.text);
      },
    },
  );
}
