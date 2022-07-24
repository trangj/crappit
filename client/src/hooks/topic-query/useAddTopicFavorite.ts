import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import axios from '../../axiosConfig';

async function favoriteTopic(topic: string) {
  try {
    const res = await axios.post(`/api/topic/${topic}/favorite_topic`);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useAddTopicFavorite() {
  const queryClient = useQueryClient();
  return useMutation<any, any, any, any>(favoriteTopic, {
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
    onError: (err: any) => {
      toast.error(err.status.text);
    },
  });
}
