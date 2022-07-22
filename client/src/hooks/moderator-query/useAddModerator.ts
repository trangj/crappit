import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { Topic } from 'src/types/entities/topic';
import axios from '../../axiosConfig';

type mutateType = {
  topic: string,
  username: string,
  can_manage_posts_and_comments: boolean,
  can_manage_settings: boolean,
  can_manage_everything: boolean
}

async function addModerator({
  topic, username, can_manage_posts_and_comments, can_manage_settings, can_manage_everything,
}: mutateType) {
  try {
    const res = await axios.post(`/api/moderation/${topic}/user`, {
      username,
      can_manage_posts_and_comments,
      can_manage_settings,
      can_manage_everything,
    });
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useAddModerator(topic: Topic) {
  const queryClient = useQueryClient();
  return useMutation(addModerator, {
    onSuccess: (res) => {
      queryClient.setQueryData(['topic', topic.title], (initialData: any) => {
        initialData.moderators.push(res.user);
        return initialData;
      });
      toast.success(res.status.text);
    },
    onError: (err: any) => {
      toast.error(err.status.text);
    },
  });
}
