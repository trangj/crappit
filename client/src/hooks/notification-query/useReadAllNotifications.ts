import { useQueryClient, useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { Error } from 'src/types/error';
import { Response } from 'src/types/response';
import axios from '../../axiosConfig';

async function readAllNotifications() {
  try {
    const res = await axios.post('/api/notification/read_all');
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useReadAllNotifications() {
  const queryClient = useQueryClient();
  return useMutation<Response, Error>(readAllNotifications, {
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
