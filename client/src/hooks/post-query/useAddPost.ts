import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import axios from '../../axiosConfig';

async function addPost({ formData }: { formData: FormData; }) {
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
  return useMutation(addPost, {
    onSuccess: (res) => {
      const { topic, id } = res.post;
      queryClient.invalidateQueries(['posts', topic]);
      toast.success(res.status.text);
      router.push(`/t/${topic}/comments/${id}`);
    },
    onError: (err: any) => {
      toast.error(err.status.text);
    },
  });
}
