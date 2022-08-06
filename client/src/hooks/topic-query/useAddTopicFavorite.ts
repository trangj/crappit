import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { Error } from 'src/types/error';
import { Response } from 'src/types/response';
import axios from '../../axiosConfig';

interface MutationResponse extends Response {
  topic_id: number,
  favorite: boolean;
}

async function favoriteTopic(topic: string) {
  try {
    const res = await axios.put(`/api/topic/${topic}/favorite_topic`);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useAddTopicFavorite() {
  const queryClient = useQueryClient();
  return useMutation<MutationResponse, Error, string>(favoriteTopic, {
    onSuccess: (res) => {
      queryClient.setQueryData(['followed_topics'], (initialData: any) => {
        initialData.topics_followed = initialData.topics_followed.map((followed_topic: any) => {
          if (res.topic_id === followed_topic.topic_id) {
            followed_topic.favorite = res.favorite;
          }
          return followed_topic;
        });
        return initialData;
      });
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
