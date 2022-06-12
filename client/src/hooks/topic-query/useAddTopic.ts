import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import axios from '../../axiosConfig';

async function addTopic({ formData }: { formData: FormData; }) {
  try {
    const res = await axios.post('/api/topic', formData);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useAddTopic() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(addTopic, {
    onSuccess: (res) => {
      queryClient.setQueryData(['followed_topics'], (initialData: any) => {
        initialData.topics_followed.push(res.topic);
        return initialData;
      });
      toast.success(res.status.text);
      router.push(`/t/${res.topic.title}`);
    },
    onError: (err: any) => {
      toast.error(err.status.text);
    },
  });
}
