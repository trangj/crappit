import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { Error } from 'src/types/error';
import { Response } from 'src/types/response';
import axios from '../../axiosConfig';

interface MutationResponse extends Response {
  topic: {
    description: string,
    headline: string
  };
}

interface MutationParams {
  topic: string
  newTopic: {
    description: string,
    headline: string
  }
}

async function updateTopic(
  { topic, newTopic }: MutationParams,
) {
  try {
    const res = await axios.put(`/api/moderation/${topic}`, newTopic);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useUpdateTopic(topic: string) {
  const queryClient = useQueryClient();
  return useMutation<MutationResponse, Error, MutationParams>(updateTopic, {
    onSuccess: (res) => {
      queryClient.setQueryData(['topic', topic], (initalData: any) => {
        initalData.description = res.topic.description;
        initalData.headline = res.topic.headline;
        return initalData;
      });
      toast.success(res.status.text);
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
