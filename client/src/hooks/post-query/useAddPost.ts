import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { Error } from 'src/types/error';
import { Response } from 'src/types/response';
import axios from '../../axiosConfig';

interface MutationResponse extends Response {
  post: {
    topic: string,
    id: number
  };
}

interface MutationParams {
  formData: FormData
}

async function addPost({ formData }: MutationParams) {
  try {
    const res = await axios.post('/api/post', formData);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useAddPost() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation<MutationResponse, Error, MutationParams>(addPost, {
    onSuccess: (res) => {
      const { topic, id } = res.post;
      queryClient.invalidateQueries(['posts', topic]);
      toast.success(res.status.text);
      router.push(`/t/${topic}/comments/${id}`);
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
