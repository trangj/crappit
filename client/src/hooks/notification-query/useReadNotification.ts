import { useQueryClient, useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { Error } from 'src/types/error';
import axios from '../../axiosConfig';

async function readNotification({ id }: {id: number}) {
  try {
    const res = await axios.post('/api/notification/read', { id });
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useReadNotification() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, any, any>(readNotification, {
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
