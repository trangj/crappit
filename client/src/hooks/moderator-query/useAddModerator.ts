import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { Topic } from 'src/types/entities/topic';
import { Response } from 'src/types/response';
import { Error } from 'src/types/error';
import axios from '../../axiosConfig';

interface MutationResponse extends Response {
  user: {
    user_id: number,
    username: string,
    topic_id: number,
    can_manage_everything: boolean,
    can_manage_posts_and_comments: boolean,
    can_manage_settings: boolean,
  }
}

interface MutationParams {
  topic: string,
  username: string,
  can_manage_posts_and_comments: boolean,
  can_manage_settings: boolean,
  can_manage_everything: boolean
}

async function addModerator({
  topic, username, can_manage_posts_and_comments, can_manage_settings, can_manage_everything,
}: MutationParams) {
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
  return useMutation<MutationResponse, Error, MutationParams>(addModerator, {
    onSuccess: (res) => {
      queryClient.setQueryData(['topic', topic.title], (initialData: any) => {
        initialData.moderators.push(res.user);
        return initialData;
      });
      toast.success(res.status.text);
    },
    onError: (err) => {
      toast.error(err.status.text);
    },
  });
}
