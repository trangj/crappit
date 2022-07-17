import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { Topic } from 'src/types/entities/topic';
import axios from '../../axiosConfig';

async function deleteModerator({ topic, id }: { topic: string, id: number; }) {
  try {
    const res = await axios.delete(`/api/moderation/${topic}/user/${id}`);
    return res.data;
  } catch (err: any) {
    throw err.response.data;
  }
}

export default function useDeleteModerator(topic: Topic) {
  const queryClient = useQueryClient();
  return useMutation(deleteModerator, {
    onSuccess: (res) => {
      queryClient.setQueryData(['topic', topic.title], (initialData: any) => {
        initialData.moderators = initialData.moderators.filter(
          (moderator: any) => moderator.user_id !== res.user.user_id,
        );
        return initialData;
      });
      toast.success(res.status.text);
    },
    onError: (err: any) => {
      toast.error(err.status.text);
    },
  });
}
