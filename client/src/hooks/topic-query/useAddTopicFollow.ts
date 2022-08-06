import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { Topic } from 'src/types/entities/topic';
import { Error } from 'src/types/error';
import { Response } from 'src/types/response';
import axios from '../../axiosConfig';

interface MutationResponse extends Response {
  user_followed_id: number,
  follow: {
    topic_id: number,
    user_id: number,
    favorite: boolean,
  }
}

async function followTopic(topic: string) {
  try {
    const res = await axios.post(`/api/topic/${topic}/follow_topic`);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useAddTopicFollow(topic: Topic) {
  const queryClient = useQueryClient();
  return useMutation<MutationResponse, Error, string>(followTopic, {
    onSuccess: (res) => {
      queryClient.setQueryData(['topic', topic.title], (initialData: any) => {
        initialData.user_followed_id = res.user_followed_id;
        initialData.number_of_followers += res.user_followed_id ? 1 : -1;
        return initialData;
      });
      queryClient.setQueryData(['followed_topics'], (initialData: any) => {
        if (res.user_followed_id) {
          initialData.topics_followed.push({
            ...res.follow,
            title: topic.title,
            icon_image_url: topic.icon_image_url,
            icon_image_name: topic.icon_image_name,
          });
        } else {
          initialData.topics_followed = initialData.topics_followed.filter(
            (i: any) => i.topic_id !== topic.id,
          );
        }
        return initialData;
      });
      toast.success(res.status.text);
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
