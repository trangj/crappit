import { useQueryClient, useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { Error } from 'src/types/error';
import { Response } from 'src/types/response';
import axios from '../../axiosConfig';

interface MutationParams {
  id: number
}

async function readNotification({ id }: MutationParams) {
  try {
    const res = await axios.post('/api/notification/read', { id });
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useReadNotification() {
  const queryClient = useQueryClient();
  return useMutation<Response, Error, MutationParams>(readNotification, {
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
